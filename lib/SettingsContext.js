import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { sdk } from "./apiClient";
const SettingsContext = createContext();

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({
  children,
  setCommands,
  commands,
  promptCategories,
  setPromptCategories,
  prompts,
  setPrompts,
  conversations,
  setConversations,
  conversationName,
  setConversation,
  conversation,
}) {
  const [providerSettings, setProviderSettings] = useState({});
  const [extensionSettings, setExtensionSettings] = useState({});
  const [hasFiles, setHasFiles] = useState(false);
  const router = useRouter();
  const agentName = router.query.agent || "gpt4free";

  useEffect(() => {
    const fetchCommands = async () => {
      const commandList = await sdk.getCommands(agentName);
      setCommands(commandList);
    };
    const fetchProviderSettings = async () => {
      const allProviders = await sdk.getAllProviders();
      const settingsForAllProviders = Object.values(allProviders).reduce(
        (acc, cur) => ({ ...acc, ...cur }),
        {}
      );
      setProviderSettings(settingsForAllProviders);
    };
    const fetchExtensionSettings = async () => {
      const settings = await sdk.getExtensionSettings();
      setExtensionSettings(settings);
    };
    const fetchPromptCategories = async () => {
      const categories = await sdk.getPromptCategories();
      setPromptCategories(categories);
    };
    const fetchPrompts = async () => {
      const prompts = await sdk.getPrompts("Default");
      setPrompts(prompts);
    };
    const fetchConversations = async () => {
      const conversations = await sdk.getConversations();
      setConversations(conversations);
    };
    // "I have read the file contents of" is in the conversation,
    let conversationHasFiles = false;
    if (conversation) {
      conversationHasFiles = conversation.some((chatItem) => {
        return chatItem.message.includes("I have read the file contents of");
      });
    }
    setHasFiles(conversationHasFiles);
    fetchConversations();
    fetchPrompts();
    fetchPromptCategories();
    fetchCommands();
    fetchProviderSettings();
    fetchExtensionSettings();
  }, []);

  useEffect(() => {
    const fetchConversation = async () => {
      const convo = await sdk.getConversation(
        router.query.agent,
        conversationName,
        100,
        1
      );
      setConversation(convo);
    };
    fetchConversation();
  }, [conversationName]);

  if (
    providerSettings === undefined ||
    extensionSettings === undefined ||
    commands === undefined ||
    promptCategories === undefined ||
    prompts === undefined ||
    conversations === undefined ||
    conversation === undefined ||
    hasFiles === undefined
  ) {
    return <div>Loading...</div>;
  } else {
    return (
      <SettingsContext.Provider
        value={{
          providerSettings,
          extensionSettings,
          commands,
          promptCategories,
          prompts,
          conversations,
          conversation,
          hasFiles,
        }}
      >
        {children}
      </SettingsContext.Provider>
    );
  }
}

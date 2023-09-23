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
}) {
  const [providerSettings, setProviderSettings] = useState({});
  const [extensionSettings, setExtensionSettings] = useState({});
  const router = useRouter();
  const agentName = router.query.agent;

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
    fetchPrompts();
    fetchPromptCategories();
    fetchCommands();
    fetchProviderSettings();
    fetchExtensionSettings();
  }, []);
  useEffect(() => {
    const fetchCommands = async () => {
      const commandList = await sdk.getCommands(agentName);
      setCommands(commandList);
    };
    if (agentName) {
      fetchCommands();
    }
  }, [agentName]);

  return (
    <SettingsContext.Provider
      value={{
        providerSettings,
        extensionSettings,
        commands,
        promptCategories,
        prompts,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

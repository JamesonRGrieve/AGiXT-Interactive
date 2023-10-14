import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { sdk } from "./apiClient";
const SettingsContext = createContext();

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({
  children,
  commands,
  promptCategories,
  prompts,
  conversationName,
  setConversation,
  conversation,
}) {
  const [hasFiles, setHasFiles] = useState(false);
  const router = useRouter();

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
    commands === undefined ||
    promptCategories === undefined ||
    prompts === undefined ||
    conversation === undefined ||
    hasFiles === undefined
  ) {
    return <div>Loading...</div>;
  } else {
    return (
      <SettingsContext.Provider
        value={{
          commands,
          promptCategories,
          prompts,
          conversation,
          hasFiles,
        }}
      >
        {children}
      </SettingsContext.Provider>
    );
  }
}

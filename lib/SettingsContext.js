import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { sdk } from "./apiClient";
const SettingsContext = createContext();

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children, setCommands, commands }) {
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
      const settingsForAllProviders = await sdk.getAllProviders();
      setProviderSettings(settingsForAllProviders);
    };

    // Fetch extension settings once
    const fetchExtensionSettings = async () => {
      const settings = await sdk.getExtensionSettings();
      setExtensionSettings(settings);
    };
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
      value={{ providerSettings, extensionSettings, commands }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

import React, { createContext, useContext, useState, useEffect } from "react";
import { sdk } from "./apiClient";
const SettingsContext = createContext();

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }) {
  const [providerSettings, setProviderSettings] = useState({});
  const [extensionSettings, setExtensionSettings] = useState({});

  useEffect(() => {
    // Fetch all provider settings once
    const fetchProviderSettings = async () => {
      const allProviders = await sdk.getProviders();
      const settingsForAllProviders = {};

      for (let provider of allProviders) {
        settingsForAllProviders[provider] = await sdk.getProviderSettings(
          provider
        );
      }

      setProviderSettings(settingsForAllProviders);
    };

    // Fetch extension settings once
    const fetchExtensionSettings = async () => {
      const settings = await sdk.getExtensionSettings();
      setExtensionSettings(settings);
    };

    fetchProviderSettings();
    fetchExtensionSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ providerSettings, extensionSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

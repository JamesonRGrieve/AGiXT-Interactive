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
      const allProviders = await sdk.getProviders();
      const settingsForAllProviders = {};

      for (let provider of allProviders) {
        if (
          provider != "pipeline" &&
          provider != "llamacpp" &&
          provider != "palm"
        ) {
          settingsForAllProviders[provider] = await sdk.getProviderSettings(
            provider
          );
        } else {
          // Hard coding requirements for these to prevent bad load times from dependency installs on back end.
          settingsForAllProviders[provider] = {
            AI_MODEL: "default",
            MAX_TOKENS: 4096,
            AI_TEMPERATURE: 0.7,
            MODEL_PATH: "",
          };
          if (provider == "palm") {
            settingsForAllProviders[provider].PALM_API_KEY = "";
          }
          if (provider == "pipeline") {
            settingsForAllProviders[provider].HUGGINGFACE_API_KEY = "";
          }
          if (provider == "llamacpp") {
            settingsForAllProviders[provider].STOP_SEQUENCE = "</s>";
            settingsForAllProviders[provider].GPU_LAYERS = 0;
            settingsForAllProviders[provider].BATCH_SIZE = 2048;
            settingsForAllProviders[provider].THREADS = 0;
          }
        }
        settingsForAllProviders[provider]["WEBSEARCH_TIMEOUT"] = 0;
        settingsForAllProviders[provider]["AUTONOMOUS_EXECUTION"] = false;
        settingsForAllProviders[provider]["helper_agent_name"] = "";
        settingsForAllProviders[provider]["embedder"] = "default";
      }

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

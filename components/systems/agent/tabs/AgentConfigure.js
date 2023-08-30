import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";
import useSWR from "swr";
import { mutate } from "swr";
import {
  TextField,
  Button,
  Divider,
  Container,
  Slider,
  Box,
  MenuItem,
  Select,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";

export default function AgentAdmin() {
  const agentName = useRouter().query.agent;
  const [provider, setProvider] = useState(null);
  const [fields, setFields] = useState({});
  const [fieldValues, setFieldValues] = useState({});
  const [displayNames, setDisplayNames] = useState({});
  const agentConfig = useSWR(`agent/${agentName}`, async () =>
    sdk.getAgentConfig(agentName)
  );
  const providers = useSWR("provider", async () => await sdk.getProviders());
  const extensionSettings = useSWR(
    `extensionSettings`,
    async () => await sdk.getExtensionSettings()
  );
  const providerSettings = useSWR(
    `provider/${provider}`,
    async () => await sdk.getProviderSettings(provider)
  );

  const transformExtensionSettings = (extensionSettings) => {
    let transformed = {};
    let displayNames = {};

    for (let extension in extensionSettings) {
      const extensionName = extension
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      for (let setting in extensionSettings[extension]) {
        const settingName = setting
          .split("_")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");

        // If setting name includes "API", capitalize it
        if (settingName.includes("Api")) {
          settingName = settingName.replace("Api", "API");
        }
        if (settingName.includes("Stt")) {
          settingName = settingName.replace("Stt", "STT");
        }
        if (settingName.includes("Tts")) {
          settingName = settingName.replace("Tts", "TTS");
        }
        if (extensionName.includes("Stt")) {
          extensionName = extensionName.replace("Stt", "STT");
        }
        if (extensionName.includes("Tts")) {
          extensionName = extensionName.replace("Tts", "TTS");
        }
        if (settingName.includes(extensionName)) {
          settingName = settingName.replace(extensionName, "");
        }

        if (extensionName != "Dalle") {
          const displayName = `${extensionName} - ${settingName}`;
          displayNames[setting] = displayName;
        }
        if (extensionName == "Dalle" && provider != "openai") {
          const displayName = `${extensionName} - ${settingName}`;
          displayNames[setting] = displayName;
        }
        if (
          extensionName == "Stable Diffusion" &&
          settingName == "Huggingface API Key"
        ) {
          // Change it to "Huggingface" from "Stable Diffusion"
          const displayName = `Huggingface - API Key`;
          displayNames[setting] = displayName;
        }
        transformed[setting] = extensionSettings[extension][setting];
      }
    }

    return {
      transformedSettings: transformed,
      displayNames: displayNames,
    };
  };

  const sliderModes = [
    "MAX_TOKENS",
    "AI_TEMPERATURE",
    "AI_TOP_P",
    "TOP_P",
    "TOP_K",
    "TOP_A",
    "TYPICAL_P",
    "EPSILON_CUTOFF",
    "ETA_CUTOFF",
    "TFS",
    "REPETITION_PENALTY",
    "ENCODER_REPETITION_PENALTY",
    "MIN_LENGTH",
    "NO_REPEAT_NGRAM_SIZE",
    "NUM_BEAMS",
    "PENALTY_ALPHA",
    "LENGTH_PENALTY",
    "MIROSTAT_MODE",
    "MIROSTAT_TAU",
    "MIROSTAT_ETA",
  ];

  const handleConfigure = async () => {
    await sdk.updateAgent(agentName, { provider: provider, ...fieldValues });
    mutate(`agent/${agentName}`);
  };
  useEffect(() => {
    if (agentConfig.data?.settings?.provider) {
      const currentProvider = agentConfig.data.settings.provider;
      setProvider(provider || currentProvider);
      const currentSettings = { ...agentConfig.data.settings };
      delete currentSettings.provider;
      setFieldValues((prev) => ({
        ...prev,
        ...currentSettings,
      }));
    }
  }, [agentConfig]);

  useEffect(() => {
    if (provider !== null && providerSettings.data && extensionSettings.data) {
      const { transformedSettings, displayNames } = transformExtensionSettings(
        extensionSettings.data
      );

      const mergedSettings = {
        ...providerSettings.data,
        ...transformedSettings,
      };
      setFields(mergedSettings);
      setDisplayNames(displayNames);
      setFieldValues((prev) => ({
        ...prev,
        ...mergedSettings,
      }));
    }

    if (provider !== null) {
      mutate(`provider/${provider}`);
    }
  }, [provider, providerSettings.data, extensionSettings.data]);

  return (
    <Container>
      <Typography variant="h4" sx={{ my: "1rem" }}>
        Agent Configuration
      </Typography>
      <Typography variant="h6" sx={{ my: "1rem" }}>
        Agent Provider
      </Typography>
      <Select
        label="Provider"
        sx={{ mx: "0.5rem", display: "block", width: "100%" }}
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
      >
        <MenuItem value={null}>Select a Provider...</MenuItem>
        {providers?.data
          ? providers.data.map((providerName) => (
              <MenuItem key={providerName} value={providerName}>
                {providerName}
              </MenuItem>
            ))
          : null}
      </Select>
      {Object.keys(fields).map((field) => {
        if (field !== "provider") {
          if (
            field.includes("USE_") ||
            field == "WORKING_DIRECTORY_RESTRICTED" ||
            field == "stream"
          ) {
            if (field == "stream") {
              let value;
              if (fieldValues[field] == "false") {
                value = false;
              } else if (fieldValues[field] == "true") {
                value = true;
              } else {
                value = null;
              }
              return (
                <>
                  <br />
                  <FormControlLabel
                    key={field}
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) =>
                          setFieldValues({
                            ...fieldValues,
                            [field]: e.target.checked,
                          })
                        }
                        name={field}
                      />
                    }
                    label={displayNames[field] || field}
                  />
                  <br />
                </>
              );
            } else {
              return (
                <>
                  <br />
                  <FormControlLabel
                    key={field}
                    control={
                      <Switch
                        checked={fieldValues[field]}
                        onChange={(e) =>
                          setFieldValues({
                            ...fieldValues,
                            [field]: e.target.checked,
                          })
                        }
                        name={field}
                      />
                    }
                    label={displayNames[field] || field}
                  />
                  <br />
                </>
              );
            }
          } else if (sliderModes.includes(field)) {
            return (
              <Box
                key={field}
                sx={{ my: "1rem", display: "flex", alignItems: "center" }}
              >
                <Slider
                  min={0}
                  max={field !== "MAX_TOKENS" ? 3 : 100000}
                  step={0.1}
                  sx={{ mr: "1rem" }}
                  value={fieldValues[field]}
                  onChange={(_, value) => handleSliderChange(field, value)}
                />
                <TextField
                  label={displayNames[field] || field}
                  value={fieldValues[field]}
                  onChange={(e) =>
                    setFieldValues((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                />
              </Box>
            );
          } else {
            // Render a TextField for other fields
            return (
              <TextField
                key={field}
                label={displayNames[field] || field}
                sx={{ my: "1rem", mx: "0.5rem", width: "100%" }}
                value={fieldValues[field]}
                onChange={(e) =>
                  setFieldValues({
                    ...fieldValues,
                    [field]: e.target.value, // Correctly set the field name as key
                  })
                }
              />
            );
          }
        }
      })}

      <br />
      <Button onClick={handleConfigure} variant="contained" color="error">
        Save Agent Configuration
      </Button>
    </Container>
  );
}

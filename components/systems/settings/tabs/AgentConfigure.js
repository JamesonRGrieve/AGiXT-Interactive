import { useState, useEffect, use } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";
import { useSettings } from "../../../../lib/SettingsContext";
import useSWR from "swr";
import { mutate } from "swr";
import {
  TextField,
  Button,
  Divider,
  Slider,
  Box,
  MenuItem,
  Select,
  Typography,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function AgentConfigure({ data, llms }) {
  const { providerSettings, extensionSettings } = useSettings();
  const [provider, setProvider] = useState(
    data?.settings?.provider || "gpt4free"
  );
  const [fields, setFields] = useState({});
  const [fieldValues, setFieldValues] = useState(data?.settings || {});
  const [displayNames, setDisplayNames] = useState({});
  const router = useRouter();
  const agentName = router.query.agent;
  const agents = useSWR("agent", async () => await sdk.getAgents());

  const transformExtensionSettings = () => {
    let transformed = {};
    let newDisplayNames = {};

    for (let extension in extensionSettings) {
      let extensionName = extension
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      for (let setting in extensionSettings[extension]) {
        let settingName = setting
          .split("_")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");

        const toCapitalize = ["Api", "Stt", "Tts"];
        for (let substring of toCapitalize) {
          settingName = settingName.replaceAll(
            substring,
            substring.toUpperCase()
          );
          extensionName = extensionName.replaceAll(
            substring,
            substring.toUpperCase()
          );
        }
        if (settingName != extensionName)
          settingName = settingName.replaceAll(extensionName, "");
        settingName = settingName.replaceAll("Tw ", "");

        if (extensionName != "Dalle") {
          const displayName = `${extensionName} - ${settingName}`;
          newDisplayNames[setting] = displayName;
        }
        if (extensionName == "Dalle" && data?.settings.provider != "openai") {
          const displayName = `${extensionName} - ${settingName}`;
          newDisplayNames[setting] = displayName;
        }
        if (
          extensionName == "Stable Diffusion" &&
          settingName == "Huggingface API Key"
        ) {
          // Change it to "Huggingface" from "Stable Diffusion"
          const displayName = `Huggingface - API Key`;
          newDisplayNames[setting] = displayName;
        }
        transformed[setting] = extensionSettings[extension][setting];
      }
    }

    return {
      transformedSettings: transformed,
      displayNames: newDisplayNames,
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
    await sdk.updateAgentSettings(agentName, {
      provider: provider,
      ...fieldValues,
    });
    mutate(`agent/${agentName}`);
  };
  useEffect(() => {
    if (data) {
      setProvider(data?.settings.provider);
      if (
        provider !== null &&
        providerSettings[data?.settings.provider] &&
        extensionSettings
      ) {
        const { transformedSettings, displayNames } =
          transformExtensionSettings();

        const mergedSettings = {
          ...providerSettings[data?.settings.provider],
          ...transformedSettings,
        };

        setFields(mergedSettings);
        setDisplayNames(displayNames);
        setFieldValues((prev) => ({
          ...prev,
          ...mergedSettings,
        }));
        setFieldValues((prev) => ({
          ...prev,
          ...data.settings,
        }));
      }
    }
  }, [agentName]);
  if (!llms || llms == []) {
    return "Loading...";
  }
  return (
    <Box>
      <TextField
        label="Agent Persona"
        sx={{ my: "1rem", mx: "0.5rem", width: "100%" }}
        value={fieldValues["PERSONA"]}
        onChange={(e) =>
          setFieldValues({
            ...fieldValues,
            persona: e.target.value,
          })
        }
        multiline
        rows={4}
      />
      <Divider />
      <Typography variant="h6" sx={{ my: "1rem" }}>
        Provider Settings [{providerSettings[provider]?.name || provider}]
      </Typography>
      {provider == "local" && fieldValues["AI_MODEL"] && (
        <>
          <FormControl fullWidth sx={{ my: "1rem", mx: "0.5rem" }}>
            <InputLabel id="ai-model-label">Select a Model</InputLabel>
            <Select
              fullWidth
              labelId="ai-model-label"
              id="ai-model-select"
              value={fieldValues["AI_MODEL"]}
              label="Select a Model"
              onChange={(e) =>
                setFieldValues({
                  ...fieldValues,
                  ["AI_MODEL"]: e.target.value,
                })
              }
            >
              {llms && llms.length > 0
                ? llms.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))
                : null}
            </Select>
          </FormControl>
        </>
      )}
      {Object.keys(fields).map((field) => {
        if (field !== "provider") {
          if (
            field.includes("USE_") ||
            field == "WORKING_DIRECTORY_RESTRICTED" ||
            field == "stream" ||
            field == "AUTONOMOUS_EXECUTION"
          ) {
            if (field == "stream") {
              return <></>;
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
                  color="info"
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
          } else if (field == "helper_agent_name") {
            // Make a list of agents
            return (
              <FormControl
                key={field}
                fullWidth
                sx={{ my: "1rem", mx: "0.5rem" }}
              >
                <InputLabel id="helper-agent-label">Helper Agent</InputLabel>
                <Select
                  fullWidth
                  labelId="helper-agent-label"
                  id="helper-agent-select"
                  value={fieldValues[field]}
                  label="Helper Agent"
                  onChange={(e) =>
                    setFieldValues({
                      ...fieldValues,
                      [field]: e.target.value,
                    })
                  }
                >
                  {agents?.data
                    ? agents.data.map(
                        (agent) =>
                          agent.name != "undefined" && (
                            <MenuItem key={agent.name} value={agent.name}>
                              {agent.name}
                            </MenuItem>
                          )
                      )
                    : null}
                </Select>
              </FormControl>
            );
          } else if (field == "persona") {
            <></>;
          } else if (field == "AI_MODEL" && provider == "local") {
            <></>;
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
    </Box>
  );
}

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
  const [provider, setProvider] = useState("initial");
  const [fields, setFields] = useState({});
  const [fieldValues, setFieldValues] = useState({});
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

    for (let extension in extensionSettings) {
      // Convert extension name from snake_case to Title Case
      const extensionName = extension
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      for (let setting in extensionSettings[extension]) {
        // Convert setting name from UPPERCASE to Title Case
        const settingName = setting
          .split("_")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");

        const combinedKey = `${extensionName} - ${settingName}`;
        transformed[combinedKey] = extensionSettings[extension][setting];
      }
    }

    return transformed;
  };
  const settings = {
    ...providerSettings.data,
    ...transformExtensionSettings(extensionSettings.data),
  };
  const fieldComponents = {
    MAX_TOKENS: (
      <Box
        key={"MAX_TOKENS"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={32}
          max={100000}
          sx={{ mr: "1rem" }}
          value={fieldValues.MAX_TOKENS}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, MAX_TOKENS: e.target.value })
          }
        />
        <TextField
          label="Maximum Tokens"
          value={fieldValues.MAX_TOKENS}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, MAX_TOKENS: e.target.value })
          }
        />
      </Box>
    ),
    AI_TEMPERATURE: (
      <Box
        key={"AI_TEMPERATURE"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={0.0}
          max={2}
          step={0.1}
          sx={{ mr: "1rem" }}
          value={fieldValues.AI_TEMPERATURE}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, AI_TEMPERATURE: e.target.value })
          }
        />
        <TextField
          label="AI Temperature"
          value={fieldValues.AI_TEMPERATURE}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, AI_TEMPERATURE: e.target.value })
          }
        />
      </Box>
    ),
    AI_TOP_P: (
      <Box
        key={"AI_TOP_P"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={0.0}
          max={2}
          step={0.1}
          sx={{ mr: "1rem" }}
          value={fieldValues.AI_TOP_P}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, AI_TOP_P: e.target.value })
          }
        />
        <TextField
          label="AI Temperature"
          value={fieldValues.AI_TOP_P}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, AI_TOP_P: e.target.value })
          }
        />
      </Box>
    ),
    TOP_P: (
      <Box
        key={"TOP_P"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={0.0}
          max={2}
          step={0.1}
          sx={{ mr: "1rem" }}
          value={fieldValues.TOP_P}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, TOP_P: e.target.value })
          }
        />
        <TextField
          label="Top P"
          value={fieldValues.TOP_P}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, TOP_P: e.target.value })
          }
        />
      </Box>
    ),
    TOP_K: (
      <Box
        key={"TOP_K"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={0}
          max={100}
          sx={{ mr: "1rem" }}
          value={fieldValues.TOP_K}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, TOP_K: e.target.value })
          }
        />
        <TextField
          label="Top K"
          value={fieldValues.TOP_K}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, TOP_K: e.target.value })
          }
        />
      </Box>
    ),
    TOP_A: (
      <Box
        key={"TOP_A"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={0.0}
          max={2}
          step={0.1}
          sx={{ mr: "1rem" }}
          value={fieldValues.TOP_A}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, TOP_A: e.target.value })
          }
        />
        <TextField
          label="Top A"
          value={fieldValues.TOP_A}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, TOP_A: e.target.value })
          }
        />
      </Box>
    ),
    DO_SAMPLE: (
      <Box
        key={"DO_SAMPLE"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={0.0}
          max={1}
          step={0.1}
          sx={{ mr: "1rem" }}
          value={fieldValues.DO_SAMPLE}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, DO_SAMPLE: e.target.value })
          }
        />
        <TextField
          label="Do Sample"
          value={fieldValues.DO_SAMPLE}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, DO_SAMPLE: e.target.value })
          }
        />
      </Box>
    ),
    TYPICAL_P: (
      <Box
        key={"TYPICAL_P"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={0.0}
          max={1}
          step={0.1}
          sx={{ mr: "1rem" }}
          value={fieldValues.TYPICAL_P}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, TYPICAL_P: e.target.value })
          }
        />
        <TextField
          label="Typical P"
          value={fieldValues.TYPICAL_P}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, TYPICAL_P: e.target.value })
          }
        />
      </Box>
    ),
    EPSILON_CUTOFF: (
      <Box
        key={"EPSILON_CUTOFF"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={0.1}
          max={1}
          step={0.1}
          sx={{ mr: "1rem" }}
          value={fieldValues.EPSILON_CUTOFF}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, EPSILON_CUTOFF: e.target.value })
          }
        />
        <TextField
          label="Epsilon Cutoff"
          value={fieldValues.EPSILON_CUTOFF}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, EPSILON_CUTOFF: e.target.value })
          }
        />
      </Box>
    ),
    ETA_CUTOFF: (
      <Box
        key={"ETA_CUTOFF"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={0.1}
          max={1}
          step={0.1}
          sx={{ mr: "1rem" }}
          value={fieldValues.ETA_CUTOFF}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, ETA_CUTOFF: e.target.value })
          }
        />
        <TextField
          label="Eta Cutoff"
          value={fieldValues.ETA_CUTOFF}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, ETA_CUTOFF: e.target.value })
          }
        />
      </Box>
    ),
    TFS: (
      <Box
        key={"TFS"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={1}
          max={100}
          sx={{ mr: "1rem" }}
          value={fieldValues.TFS}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, TFS: e.target.value })
          }
        />
        <TextField
          label="TFS"
          value={fieldValues.TFS}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, TFS: e.target.value })
          }
        />
      </Box>
    ),
    REPETITION_PENALTY: (
      <Box
        key={"REPETITION_PENALTY"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={1}
          max={100}
          sx={{ mr: "1rem" }}
          value={fieldValues.REPETITION_PENALTY}
          onChange={(e) =>
            setFieldValues({
              ...fieldValues,
              REPETITION_PENALTY: e.target.value,
            })
          }
        />
        <TextField
          label="Repetition Penalty"
          value={fieldValues.REPETITION_PENALTY}
          onChange={(e) =>
            setFieldValues({
              ...fieldValues,
              REPETITION_PENALTY: e.target.value,
            })
          }
        />
      </Box>
    ),
    ENCODER_REPETITION_PENALTY: (
      <Box
        key={"ENCODER_REPETITION_PENALTY"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={1}
          max={100}
          sx={{ mr: "1rem" }}
          value={fieldValues.ENCODER_REPETITION_PENALTY}
          onChange={(e) =>
            setFieldValues({
              ...fieldValues,
              ENCODER_REPETITION_PENALTY: e.target.value,
            })
          }
        />
        <TextField
          label="Encoder Repetition Penalty"
          value={fieldValues.ENCODER_REPETITION_PENALTY}
          onChange={(e) =>
            setFieldValues({
              ...fieldValues,
              ENCODER_REPETITION_PENALTY: e.target.value,
            })
          }
        />
      </Box>
    ),
    MIN_LENGTH: (
      <Box
        key={"MIN_LENGTH"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={1}
          max={100}
          sx={{ mr: "1rem" }}
          value={fieldValues.MIN_LENGTH}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, MIN_LENGTH: e.target.value })
          }
        />
        <TextField
          label="Minimum Length"
          value={fieldValues.MIN_LENGTH}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, MIN_LENGTH: e.target.value })
          }
        />
      </Box>
    ),
    NO_REPEAT_NGRAM_SIZE: (
      <Box
        key={"NO_REPEAT_NGRAM_SIZE"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={1}
          max={100}
          sx={{ mr: "1rem" }}
          value={fieldValues.NO_REPEAT_NGRAM_SIZE}
          onChange={(e) =>
            setFieldValues({
              ...fieldValues,
              NO_REPEAT_NGRAM_SIZE: e.target.value,
            })
          }
        />
        <TextField
          label="No Repeat Ngram Size"
          value={fieldValues.NO_REPEAT_NGRAM_SIZE}
          onChange={(e) =>
            setFieldValues({
              ...fieldValues,
              NO_REPEAT_NGRAM_SIZE: e.target.value,
            })
          }
        />
      </Box>
    ),
    NUM_BEAMS: (
      <Box
        key={"NUM_BEAMS"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={1}
          max={100}
          sx={{ mr: "1rem" }}
          value={fieldValues.NUM_BEAMS}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, NUM_BEAMS: e.target.value })
          }
        />
        <TextField
          label="Number of Beams"
          value={fieldValues.NUM_BEAMS}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, NUM_BEAMS: e.target.value })
          }
        />
      </Box>
    ),
    PENALTY_ALPHA: (
      <Box
        key={"PENALTY_ALPHA"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={1}
          max={100}
          sx={{ mr: "1rem" }}
          value={fieldValues.PENALTY_ALPHA}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, PENALTY_ALPHA: e.target.value })
          }
        />
        <TextField
          label="Penalty Alpha"
          value={fieldValues.PENALTY_ALPHA}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, PENALTY_ALPHA: e.target.value })
          }
        />
      </Box>
    ),
    LENGTH_PENALTY: (
      <Box
        key={"LENGTH_PENALTY"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={1}
          max={100}
          sx={{ mr: "1rem" }}
          value={fieldValues.LENGTH_PENALTY}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, LENGTH_PENALTY: e.target.value })
          }
        />
        <TextField
          label="Length Penalty"
          value={fieldValues.LENGTH_PENALTY}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, LENGTH_PENALTY: e.target.value })
          }
        />
      </Box>
    ),
    MIROSTAT_MODE: (
      <Box
        key={"MIROSTAT_MODE"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={1}
          max={100}
          sx={{ mr: "1rem" }}
          value={fieldValues.MIROSTAT_MODE}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, MIROSTAT_MODE: e.target.value })
          }
        />
        <TextField
          label="Mirostat Mode"
          value={fieldValues.MIROSTAT_MODE}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, MIROSTAT_MODE: e.target.value })
          }
        />
      </Box>
    ),
    MIROSTAT_TAU: (
      <Box
        key={"MIROSTAT_TAU"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={1}
          max={100}
          sx={{ mr: "1rem" }}
          value={fieldValues.MIROSTAT_TAU}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, MIROSTAT_TAU: e.target.value })
          }
        />
        <TextField
          label="Mirostat Tau"
          value={fieldValues.MIROSTAT_TAU}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, MIROSTAT_TAU: e.target.value })
          }
        />
      </Box>
    ),
    MIROSTAT_ETA: (
      <Box
        key={"MIROSTAT_ETA"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={1}
          max={100}
          sx={{ mr: "1rem" }}
          value={fieldValues.MIROSTAT_ETA}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, MIROSTAT_ETA: e.target.value })
          }
        />
        <TextField
          label="Mirostat Eta"
          value={fieldValues.MIROSTAT_ETA}
          onChange={(e) =>
            setFieldValues({ ...fieldValues, MIROSTAT_ETA: e.target.value })
          }
        />
      </Box>
    ),
  };
  const handleConfigure = async () => {
    await sdk.updateAgent(agentName, { provider: provider, ...fieldValues });
    mutate(`agent/${agentName}`);
  };
  useEffect(() => {
    if (agentConfig.data.settings?.provider) {
      const newFieldValues = { ...agentConfig.data.settings };
      setProvider(agentConfig.data.settings.provider);
      delete newFieldValues.provider;
      setFieldValues(newFieldValues);
    }
  }, [agentConfig]);
  useEffect(() => {
    async function getAndSetFields() {
      setFields(settings);
    }
    if (provider != "initial") getAndSetFields();
  }, [provider]);
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
        sx={{ mx: "0.5rem", display: "block", width: "80%" }} // Add 'display: "block"' here
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
      >
        <MenuItem value={"initial"}>Select a Provider...</MenuItem>
        {providers?.data
          ? providers.data.map((providerName) => (
              <MenuItem key={providerName} value={providerName}>
                {providerName}
              </MenuItem>
            ))
          : null}
      </Select>
      {Object.keys(fields).map((field) => {
        if (fieldComponents[field]) {
          return fieldComponents[field];
        } else {
          if (field !== "provider") {
            if (field.includes(" - Use ")) {
              // Render a switch for boolean fields with " - Use " in their name
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
                    label={field}
                  />
                  <br />
                </>
              );
            } else {
              // Render a TextField for other fields
              return (
                <TextField
                  key={field}
                  label={field}
                  sx={{ my: "1rem", mx: "0.5rem", width: "80%" }}
                  value={fieldValues[field]}
                  onChange={(e) =>
                    setFieldValues({
                      ...fieldValues,
                      [field]: e.target.value,
                    })
                  }
                />
              );
            }
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

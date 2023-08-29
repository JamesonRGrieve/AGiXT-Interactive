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
  const fieldComponents = {
    MODEL_PATH: (
      <TextField
        key={"MODEL_PATH"}
        label="Model Path"
        sx={{ my: "1rem", mx: "0.5rem" }}
        value={fieldValues.MODEL_PATH}
        onChange={(e) =>
          setFieldValues({ ...fieldValues, MODEL_PATH: e.target.value })
        }
      />
    ),
    AI_PROVIDER_URI: (
      <TextField
        key={"AI_PROVIDER_URI"}
        label="AI Provider URI"
        sx={{ my: "1rem", mx: "0.5rem" }}
        value={fieldValues.AI_PROVIDER_URI}
        onChange={(e) =>
          setFieldValues({ ...fieldValues, AI_PROVIDER_URI: e.target.value })
        }
      />
    ),
    AI_MODEL: (
      <TextField
        key={"AI_MODEL"}
        label="AI Model"
        sx={{ my: "1rem", mx: "0.5rem" }}
        value={fieldValues.AI_MODEL}
        onChange={(e) =>
          setFieldValues({ ...fieldValues, AI_MODEL: e.target.value })
        }
      />
    ),
    CHATGPT_USERNAME: (
      <TextField
        key={"CHATGPT_USERNAME"}
        label="ChatGPT Username"
        sx={{ my: "1rem", mx: "0.5rem" }}
        value={fieldValues.CHATGPT_USERNAME}
        onChange={(e) =>
          setFieldValues({ ...fieldValues, CHATGPT_USERNAME: e.target.value })
        }
      />
    ),
    CHATGPT_PASSWORD: (
      <TextField
        key={"CHATGPT_PASSWORD"}
        label="ChatGPT Password"
        sx={{ my: "1rem", mx: "0.5rem" }}
        value={fieldValues.CHATGPT_PASSWORD}
        onChange={(e) =>
          setFieldValues({ ...fieldValues, CHATGPT_PASSWORD: e.target.value })
        }
      />
    ),
    OPENAI_API_KEY: (
      <TextField
        key={"OPENAI_API_KEY"}
        label="OpenAI API Key"
        sx={{ my: "1rem", mx: "0.5rem" }}
        value={fieldValues.OPENAI_API_KEY}
        onChange={(e) =>
          setFieldValues({ ...fieldValues, OPENAI_API_KEY: e.target.value })
        }
      />
    ),
    BARD_TOKEN: (
      <TextField
        key={"BARD_TOKEN"}
        label="Bard Token"
        sx={{ my: "1rem", mx: "0.5rem" }}
        value={fieldValues.BARD_TOKEN}
        onChange={(e) =>
          setFieldValues({ ...fieldValues, BARD_TOKEN: e.target.value })
        }
      />
    ),
    MAX_TOKENS: (
      <Box
        key={"MAX_TOKENS"}
        sx={{ my: "1rem", display: "flex", alignItems: "center" }}
      >
        <Slider
          min={32}
          max={8192}
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
          min={0.1}
          max={1}
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
      const providerSettings = await sdk.getProviderSettings(provider);
      setFields(providerSettings);
    }
    if (provider != "initial") getAndSetFields();
  }, [provider]);
  return (
    <Container>
      <Typography variant="h6" sx={{ my: "1rem" }}>
        Agent Provider
      </Typography>
      <Typography variant="body1" sx={{ my: "1rem" }}>
        <b>
          <a
            href="https://github.com/Josh-XT/AGiXT/tree/main/docs/providers"
            target="_blank"
          >
            CLICK HERE FOR PROVIDER DOCUMENTATION
          </a>
        </b>
      </Typography>
      <Select
        label="Provider"
        sx={{ mx: "0.5rem", display: "block" }} // Add 'display: "block"' here
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
      <Typography variant="h6" sx={{ my: "1rem" }}>
        Provider Settings
      </Typography>
      {Object.keys(fields).map((field) => {
        if (fieldComponents[field]) {
          return fieldComponents[field];
        } else {
          // Put skip args here!
          if (field != "provider") {
            return (
              <TextField
                key={field}
                label={field}
                sx={{ my: "1rem", mx: "0.5rem" }}
                value={fieldValues[field]}
                onChange={(e) =>
                  setFieldValues({ ...fieldValues, [field]: e.target.value })
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

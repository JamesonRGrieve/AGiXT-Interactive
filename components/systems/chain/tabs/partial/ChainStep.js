import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { sdk } from "../../../../../lib/apiClient";
import { useTheme } from "@emotion/react";
import {
  Typography,
  Paper,
  MenuItem,
  TextField,
  IconButton,
  Box,
  Select,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Container,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ArrowCircleUp,
  ArrowCircleDown,
  HighlightOff,
  ExpandCircleDownOutlined,
  SaveRounded,
} from "@mui/icons-material";
import StepTypeChain from "../../step_types/StepTypeChain";
import PromptSelector from "../../../prompt/PromptSelector";
import CommandSelector from "../../../command/CommandSelector";
export default function ChainStep({
  step,
  last_step,
  agent_name,
  prompt_type,
  prompt,
  commands,
  promptCategories,
  agents,
}) {
  const pn = prompt_type == "Prompt" ? prompt.prompt_name : prompt.command_name;
  const [agentName, setAgentName] = useState(agent_name);
  const [promptName, setPromptName] = useState(pn);
  const [promptArgs, setPromptArgs] = useState(prompt);
  const [promptCategory, setPromptCategory] = useState("Default");
  const [stepType, setStepType] = useState(-1);
  const router = useRouter();
  const [modified, setModified] = useState(false);
  const theme = useTheme();
  const step_types = useMemo(
    () => [
      {
        name: "Prompt",
        component: (
          <PromptSelector
            update={setModified}
            promptCategories={promptCategories}
            promptCategory={promptCategory}
            setPromptCategory={setPromptCategory}
            promptName={promptName}
            setPromptName={setPromptName}
            promptArgs={promptArgs}
            setPromptArgs={setPromptArgs}
          />
        ),
      },
      {
        name: "Command",
        component: (
          <CommandSelector
            update={setModified}
            commands={commands}
            commandName={promptName}
            setCommandName={setPromptName}
            commandArgs={promptArgs}
            setCommandArgs={setPromptArgs}
          />
        ),
      },
      {
        name: "Chain",
        component: <StepTypeChain update={setModified} />,
      },
    ],
    [agentName, promptName]
  );
  useEffect(() => {
    setStepType(
      step_types.findIndex((step_type) => step_type.name == prompt_type)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt_type]);

  const handleIncrement = async () => {
    await sdk.moveStep(router.query.chain, step, Number(step) + 1);
    mutate("chain/" + router.query.chain);
  };
  const handleDecrement = async () => {
    await sdk.moveStep(router.query.chain, step, Number(step) - 1);
    mutate("chain/" + router.query.chain);
  };
  useEffect(() => {
    setAgentName(agent_name);
  }, [agent_name]);
  useEffect(() => {
    setPromptName(
      prompt_type == "Prompt" ? prompt.prompt_name : prompt.command_name
    );
  }, [prompt.prompt_name, prompt.command_name]);
  useEffect(() => {
    setPromptArgs(prompt);
  }, [prompt]);
  console.log("ChainStep prompt: ", prompt);
  useEffect(() => {
    if (prompt.prompt_category) {
      setPromptCategory(prompt.prompt_category);
    } else {
      setPromptCategory("Default");
    }
  }, [prompt.prompt_category]);

  const handleSave = async () => {
    prompt.prompt_name = promptName;
    prompt.prompt_category = promptCategory;

    const args = {
      step: step,
      prompt: prompt,
      agent_name: agentName,
      prompt_type: prompt_type,
    };
    console.log("ChainStep args: ", args);
    await sdk.updateStep(
      router.query.chain,
      step,
      agentName,
      step_types[stepType].name,
      args
    );
    mutate("chain/" + router.query.chain);
  };
  const handleDelete = async () => {
    await sdk.deleteStep(router.query.chain, step);
    mutate("chain/" + router.query.chain);
  };
  console.log("Prompt Type: ", prompt_type);
  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.palette.action.selected,
          borderRadius: "15px 15px 0 0",
        }}
      >
        <Typography>
          <IconButton
            onClick={handleDecrement}
            size="large"
            disabled={step == 1}
          >
            <ArrowCircleUp sx={{ fontSize: "2rem" }} />
          </IconButton>
          Step {step}
          <IconButton
            onClick={handleIncrement}
            size="large"
            disabled={last_step}
          >
            <ArrowCircleDown sx={{ fontSize: "2rem" }} />
          </IconButton>
          <IconButton onClick={handleDelete} size="large">
            <HighlightOff sx={{ fontSize: "2rem" }} color="error" />
          </IconButton>
        </Typography>
      </Box>
      <Container>
        <br />
        <FormControl sx={{ mb: 2, width: "30%" }}>
          <InputLabel>Step Type</InputLabel>
          <Select
            label="Step Type"
            value={stepType}
            onChange={(e) => {
              setStepType(e.target.value);
              setModified(true);
            }}
          >
            <MenuItem value={-1}>Select a Type...</MenuItem>
            {step_types.map((type, index) => {
              return (
                <MenuItem key={index} value={index}>
                  {type.name.replace(/\b\w/g, (s) => s.toUpperCase())}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        &nbsp;&nbsp;
        <FormControl sx={{ mb: 2, width: "30%" }}>
          <InputLabel>Agent Name</InputLabel>
          <Select
            value={agentName}
            label="Agent Name"
            onChange={(e) => {
              setAgentName(e.target.value);
              setModified(true);
            }}
          >
            {agents
              ? agents.map(
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
        {stepType !== -1 ? step_types[stepType].component : null}
        {modified ? (
          <IconButton onClick={handleSave} size="large">
            <SaveRounded sx={{ fontSize: "2rem" }} />
          </IconButton>
        ) : null}
      </Container>
    </>
  );
}

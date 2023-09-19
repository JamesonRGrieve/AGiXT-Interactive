import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { sdk } from "../../../../../lib/apiClient";
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
}) {
  const pn = prompt_type == "Prompt" ? prompt.prompt_name : prompt.command_name;
  const [agentName, setAgentName] = useState(agent_name);
  const [promptName, setPromptName] = useState(pn);
  const [promptArgs, setPromptArgs] = useState(prompt);
  const [promptCategory, setPromptCategory] = useState("Default");
  const [expanded, setExpanded] = useState(false);
  const [stepType, setStepType] = useState(-1);
  const router = useRouter();
  const [modified, setModified] = useState(false);

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
  const handleChange = () => {
    setExpanded((old) => !old);
  };
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
      <Paper
        elevation={5}
        sx={{
          padding: "0.5rem",
          display: "flex",
          flexDirection: "column",
          my: "1rem",
          fontSize: "1rem",
        }}
      >
        <Accordion expanded={expanded} onChange={handleChange}>
          <AccordionSummary
            sx={{ flexDirection: "row-reverse", alignItems: "center" }}
            expandIcon={<ExpandCircleDownOutlined />}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                mx: "0.5rem",
                flex: 1,
              }}
            >
              {expanded ? null : (
                <Typography variant="h6" sx={{ mr: "2rem" }}>
                  Step Inputs
                </Typography>
              )}
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                }}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <IconButton
                  onClick={handleDecrement}
                  size="large"
                  disabled={step == 1}
                >
                  <ArrowCircleUp sx={{ fontSize: "2rem" }} />
                </IconButton>
                <Avatar sx={{ fontWeight: "bolder" }}>{step}</Avatar>
                <IconButton
                  onClick={handleIncrement}
                  size="large"
                  disabled={last_step}
                >
                  <ArrowCircleDown sx={{ fontSize: "2rem" }} />
                </IconButton>
                <Select
                  label="Type"
                  sx={{ mx: "0.5rem" }}
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
                {stepType !== -1 ? step_types[stepType].component : null}
                {modified ? (
                  <IconButton onClick={handleSave} size="large">
                    <SaveRounded sx={{ fontSize: "2rem" }} />
                  </IconButton>
                ) : null}
                <IconButton onClick={handleDelete} size="large">
                  <HighlightOff sx={{ fontSize: "2rem" }} />
                </IconButton>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {expanded ? (
              <Typography variant="h6">Step Inputs</Typography>
            ) : null}
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                my: "0.5rem",
                mx: "2rem",
                p: "0.3rem",
              }}
            >
              <IconButton size="large">
                <HighlightOff sx={{ fontSize: "2rem" }} />
              </IconButton>
              <Select label="Type" sx={{ mx: "0.5rem" }} value={0}>
                <MenuItem value={0}>Select an Input Type...</MenuItem>
              </Select>
            </Paper>
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                my: "0.5rem",
                mx: "2rem",
                p: "0.3rem",
              }}
            >
              <IconButton size="large">
                <HighlightOff sx={{ fontSize: "2rem" }} />
              </IconButton>
              <Select label="Type" sx={{ mx: "0.5rem" }} value={0}>
                <MenuItem value={0}>Saved Output</MenuItem>
              </Select>
              <Select label="Output" sx={{ mx: "0.5rem" }} value={0}>
                <MenuItem value={0}>&quot;Step 3 Output&quot;</MenuItem>
              </Select>
              <TextField variant="outlined" value="{step3}"></TextField>
            </Paper>
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                my: "0.5rem",
                mx: "2rem",
                p: "0.3rem",
              }}
            >
              <IconButton size="large">
                <HighlightOff sx={{ fontSize: "2rem" }} />
              </IconButton>
              <Select label="Type" sx={{ mx: "0.5rem" }} value={0}>
                <MenuItem value={0}>Literal Value</MenuItem>
              </Select>
              <TextField
                variant="outlined"
                value="console.log('Hello, World!');"
              ></TextField>
              <TextField variant="outlined" value="{myLiteral}"></TextField>
            </Paper>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </>
  );
}

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { sdk } from "../../../../../lib/apiClient";
import { useTheme } from "@emotion/react";
import {
  Typography,
  MenuItem,
  IconButton,
  Box,
  Select,
  Container,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ArrowCircleUp,
  ArrowCircleDown,
  HighlightOff,
  SaveRounded,
} from "@mui/icons-material";
import PromptSelector from "../../../prompt/PromptSelector";
import CommandSelector from "../../../command/CommandSelector";
import AdvancedOptions from "../../../agent/AdvancedOptions";
import ChainArgs from "../../ChainArgs";
import ChainSelector from "../../ChainSelector";
export default function ChainStep({
  step,
  last_step,
  agent_name,
  prompt_type,
  prompt,
  promptCategories,
  agents,
}) {
  const pn =
    prompt_type == "Prompt"
      ? prompt.prompt_name
      : prompt_type == "Command"
      ? prompt.command_name
      : prompt.chain;
  const [agentName, setAgentName] = useState(agent_name);
  const [promptName, setPromptName] = useState(pn);
  const [promptArgs, setPromptArgs] = useState(step);
  const [promptCategory, setPromptCategory] = useState(
    step?.prompt_category || "Default"
  );
  const [stepType, setStepType] = useState(-1);
  const [contextResults, setContextResults] = useState(
    step?.context_results || 5
  );

  const [shots, setShots] = useState(step?.shots || step?.shot_count || 1);
  const [browseLinks, setBrowseLinks] = useState(step?.browse_links || false);
  const [websearch, setWebsearch] = useState(step?.websearch || false);
  const [websearchDepth, setWebsearchDepth] = useState(
    step?.websearch_depth || 0
  );
  const [enableMemory, setEnableMemory] = useState(
    !step?.disable_memory || false
  );
  const [
    injectMemoriesFromCollectionNumber,
    setInjectMemoriesFromCollectionNumber,
  ] = useState(step?.inject_memories_from_collection_number || 0);
  const [conversationResults, setConversationResults] = useState(
    step?.conversation_results || 5
  );

  const router = useRouter();
  const [modified, setModified] = useState(false);
  const theme = useTheme();
  const step_types = useMemo(
    () => [
      {
        name: "Prompt",
        component: (
          <>
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
            <AdvancedOptions
              update={setModified}
              promptArgs={promptArgs}
              setPromptArgs={setPromptArgs}
              contextResults={contextResults}
              setContextResults={setContextResults}
              shots={shots}
              setShots={setShots}
              browseLinks={browseLinks}
              setBrowseLinks={setBrowseLinks}
              websearch={websearch}
              setWebsearch={setWebsearch}
              websearchDepth={websearchDepth}
              setWebsearchDepth={setWebsearchDepth}
              enableMemory={enableMemory}
              setEnableMemory={setEnableMemory}
              injectMemoriesFromCollectionNumber={
                injectMemoriesFromCollectionNumber
              }
              setInjectMemoriesFromCollectionNumber={
                setInjectMemoriesFromCollectionNumber
              }
              conversationResults={conversationResults}
              setConversationResults={setConversationResults}
              fullWidth={false}
            />
          </>
        ),
      },
      {
        name: "Command",
        component: (
          <CommandSelector
            update={setModified}
            commandName={promptName}
            setCommandName={setPromptName}
            commandArgs={promptArgs}
            setCommandArgs={setPromptArgs}
          />
        ),
      },
      {
        name: "Chain",
        component: (
          <>
            <ChainSelector
              update={setModified}
              sdk={sdk}
              selectedChain={promptName}
              setSelectedChain={setPromptName}
            />
            <ChainArgs
              update={setModified}
              selectedChain={promptName}
              chainArgs={promptArgs}
              setChainArgs={setPromptArgs}
              sdk={sdk}
            />
          </>
        ),
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
      prompt_type == "Prompt"
        ? prompt.prompt_name
        : prompt_type == "Command"
        ? prompt.command_name
        : prompt.chain
    );
  }, [prompt.prompt_name, prompt.command_name, prompt.chain]);
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

  useEffect(() => {
    setContextResults(step?.context_results || 5);
    setShots(step?.shots || step?.shot_count || 1);
    setBrowseLinks(step?.browse_links || false);
    setWebsearch(step?.websearch || false);
    setWebsearchDepth(step?.websearch_depth || 0);
    setEnableMemory(!step?.disable_memory || false);
    setInjectMemoriesFromCollectionNumber(
      step?.inject_memories_from_collection_number || 0
    );
    setConversationResults(step?.conversation_results || 5);
  }, [step]);

  const handleSave = async () => {
    const args = {
      prompt_category: promptCategory,
      prompt_name: promptName,
      prompt_type: prompt_type,
      context_results: contextResults,
      shots: shots,
      browse_links: browseLinks,
      websearch: websearch,
      websearch_depth: websearchDepth,
      enable_memory: enableMemory,
      inject_memories_from_collection_number:
        injectMemoriesFromCollectionNumber,
      conversation_results: conversationResults,
      ...prompt,
    };
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
  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.palette.action.selected,
          borderRadius: "15px 15px 0 0",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bolder" }}>
          &nbsp;&nbsp;&nbsp;&nbsp;Step {step}
          <IconButton onClick={handleDecrement} disabled={step == 1}>
            <ArrowCircleUp />
          </IconButton>
          <IconButton onClick={handleIncrement} disabled={last_step}>
            <ArrowCircleDown />
          </IconButton>
          <IconButton onClick={handleDelete}>
            <HighlightOff color="error" />
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

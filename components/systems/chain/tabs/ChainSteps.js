import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";
import { mutate } from "swr";
import useSWR from "swr";
import { Typography, Box, IconButton, Container } from "@mui/material";
import { AddCircleOutline, InsertLink, LowPriority } from "@mui/icons-material";
import ChainStep from "./partial/ChainStep";
export default function ChainSteps({}) {
  const router = useRouter();
  const steps = useSWR(
    "chain/" + router.query.chain,
    async () => (await sdk.getChain(router.query.chain))[router.query.chain]
  );
  const { data: promptCategories } = useSWR(
    `promptCategories`,
    async () => await sdk.getPromptCategories()
  );
  const { data: commands } = useSWR(
    `commands`,
    async () => await sdk.getCommands("gpt4free")
  );
  const { data: agents } = useSWR("agent", async () => await sdk.getAgents());
  console.log("ChainSteps steps.data: ", steps.data);
  const handleAdd = async () => {
    // TODO: See Chain Management page in Streamlit app.  This needs modified, missing some fields..
    //  If prompt type is prompt, we need to show prompt category and prompt name drop downs.
    //  prompt_name and prompt_category are what is expected for promptArgs in addStep if prompt type is prompt.
    //  command_name and command_args are what is expected for promptArgs in addStep if prompt type is command.
    //  chain and input are what is expected for promptArgs in addStep if prompt type is chain at minimum, but we will also want to show the chain args.
    //  See Chain Management page in Streamlit app to see the available overrides/options for each prompt type.
    await sdk.addStep(
      router.query.chain,
      steps.data.steps.length + 1,
      agentName,
      promptType,
      promptArgs
    );
    mutate("chain/" + router.query.chain);
  };
  return (
    <Container>
      <Typography variant="h4" sx={{ fontWeight: "bolder" }}>
        {router.query.chain}
      </Typography>
      {steps?.data?.steps.map((step, index) => {
        return (
          <>
            <Box
              sx={{
                border: "1px solid",
                borderRadius: "15px",
              }}
            >
              <ChainStep
                key={step.step}
                {...step}
                promptCategories={promptCategories}
                commands={commands}
                agents={agents}
                last_step={steps.data.steps.length === index + 1}
                updateCallback={() => {
                  return null;
                }}
              />
              {index === steps.data.steps.length - 1 ? null : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                  }}
                ></Box>
              )}
            </Box>
            <br />
          </>
        );
      })}
      <Box
        sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}
      >
        <IconButton onClick={handleAdd}>
          <AddCircleOutline sx={{ fontSize: "2rem" }} />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: "bolder", mx: "1rem" }}>
          Add Step
        </Typography>
      </Box>
    </Container>
  );
}

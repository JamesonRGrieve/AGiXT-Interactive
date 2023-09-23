import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";
import { mutate } from "swr";
import useSWR from "swr";
import { Typography, Box, IconButton } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import ChainStep from "./partial/ChainStep";
export default function ChainSteps({ commands, steps }) {
  const router = useRouter();
  const { data: promptCategories } = useSWR(
    `promptCategories`,
    async () => await sdk.getPromptCategories()
  );

  const { data: agents } = useSWR("agent", async () => await sdk.getAgents());
  const handleAdd = async () => {
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "left",
        alignItems: "left",
        gap: "0.5rem",
        margin: "1rem",
      }}
    >
      {steps?.data?.steps &&
        steps?.data?.steps?.map((step, index) => {
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
    </Box>
  );
}

import React, { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";
import { Button, TextField, Typography, Divider } from "@mui/material";

export default function MemoryManagement({
  collectionNumber = 0,
  limit = 10,
  minRelevanceScore = 0.0,
}) {
  const router = useRouter();
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);
  const [memoryQuery, setMemoryQuery] = useState("");
  const [response, setResponse] = useState([]);

  const queryMemory = async () => {
    if (memoryQuery) {
      const res = await sdk.getAgentMemories(
        agentName,
        memoryQuery,
        limit,
        minRelevanceScore,
        collectionNumber
      );
      setResponse(res);
    }
  };

  const deleteMemory = async (memoryId) => {
    await sdk.deleteAgentMemory(agentName, memoryId, collectionNumber);
    await queryMemory();
  };

  return (
    <>
      <Typography component="h1" gutterBottom>
        <ReactMarkdown>
          The `Search Query` is essentially what you would type to the AI when
          you're talking to it, this will show you what results would be
          injected in context for anything you say to the AI based on its memory
          collection. This will find similar results to anything you type with
          relevance score from memory. You can choose to delete memories from
          the memory collection here.
        </ReactMarkdown>
      </Typography>
      <div className="query-section">
        <TextField
          value={memoryQuery}
          onChange={(e) => setMemoryQuery(e.target.value)}
          label="Search Query"
          variant="outlined"
          margin="normal"
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={queryMemory}
          style={{ marginTop: "10px" }}
        >
          Query Memory
        </Button>
      </div>

      {Object.values(response).map((memory) => (
        <div key={memory.id}>
          <Divider style={{ margin: "20px 0" }} />
          <Typography>
            <strong>Created on:</strong> {memory.timestamp}
          </Typography>
          <Typography>
            <strong>Relevance Score:</strong> {memory.relevance_score}
          </Typography>
          <Typography>
            <strong>Memory ID:</strong> {memory.id}
          </Typography>
          <Typography>
            <strong>Memory Source:</strong> {memory.external_source_name}
          </Typography>
          <Typography>
            <strong>Memory:</strong>
            <br />
            {memory.text}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteMemory(memory.id)}
          >
            Delete Memory
          </Button>
        </div>
      ))}
    </>
  );
}

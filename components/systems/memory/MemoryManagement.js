import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../lib/apiClient";
import {
  Button,
  TextField,
  Typography,
  Divider,
  Container,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

export default function MemoryManagement({ data }) {
  const router = useRouter();
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [collectionNumber, setCollectionNumber] = useState(0);
  const [limit, setLimit] = useState(10);
  const [minRelevanceScore, setMinRelevanceScore] = useState(0.0);
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
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Memory Management
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={advancedOptions}
            onChange={() => setAdvancedOptions(!advancedOptions)}
            name="advancedOptions"
            color="primary"
          />
        }
        label="Advanced Options"
      />

      {advancedOptions && (
        <div className="advanced-options">
          <TextField
            type="number"
            value={collectionNumber}
            onChange={(e) => setCollectionNumber(Number(e.target.value))}
            label="Collection Number"
            variant="outlined"
            margin="normal"
            style={{ width: "130px" }}
          />
          <TextField
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            label="Limit"
            variant="outlined"
            margin="normal"
            style={{ width: "130px" }}
          />
          <TextField
            type="number"
            value={minRelevanceScore}
            onChange={(e) => {
              let value = parseFloat(e.target.value);
              if (value < 0) value = 0;
              if (value > 1) value = 1;
              setMinRelevanceScore(value);
            }}
            label="Minimum Relevance Score"
            variant="outlined"
            margin="normal"
            inputProps={{
              step: 0.1, // Allow only increments or decrements of 0.1
              min: 0.1, // Minimum value
              max: 1, // Maximum value
            }}
            style={{ width: "200px" }}
          />
        </div>
      )}

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
    </Container>
  );
}

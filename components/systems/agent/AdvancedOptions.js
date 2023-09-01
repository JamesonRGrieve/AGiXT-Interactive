import {
  TextField,
  FormControlLabel,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";

export default function AdvancedOptions({
  contextResults,
  setContextResults,
  shots,
  setShots,
  websearchDepth,
  setWebsearchDepth,
  injectMemoriesFromCollectionNumber,
  setInjectMemoriesFromCollectionNumber,
  conversationResults,
  setConversationResults,
  browseLinks,
  setBrowseLinks,
  websearch,
  setWebsearch,
  enableMemory,
  setEnableMemory,
}) {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={showAdvancedOptions}
            onChange={() => setShowAdvancedOptions((prevState) => !prevState)}
          />
        }
        label={
          showAdvancedOptions
            ? "Hide Advanced Options"
            : "Show Advanced Options"
        }
      />
      {showAdvancedOptions && (
        <>
          <br />
          <TextField
            type="number"
            label="Context Results"
            value={contextResults}
            onChange={(e) => setContextResults(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            type="number"
            label="Shots"
            value={shots}
            onChange={(e) => setShots(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            type="number"
            label="Websearch Depth"
            value={websearchDepth}
            onChange={(e) => setWebsearchDepth(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            type="number"
            label="Inject Memories from Collection"
            value={injectMemoriesFromCollectionNumber}
            onChange={(e) =>
              setInjectMemoriesFromCollectionNumber(e.target.value)
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Conversation Results"
            type="number"
            min={0}
            max={100}
            step={1}
            value={conversationResults}
            onChange={(e) => setConversationResults(e.target.value)}
            sx={{ mb: 2 }}
          />
          <br />
          <FormControlLabel
            control={
              <Switch
                checked={browseLinks}
                onChange={(e) => setBrowseLinks(e.target.checked)}
                name="Browse Links"
              />
            }
            label="Browse Links"
          />
          <FormControlLabel
            control={
              <Switch
                checked={websearch}
                onChange={(e) => setWebsearch(e.target.checked)}
                name="Websearch"
              />
            }
            label="Websearch"
          />
          <FormControlLabel
            control={
              <Switch
                checked={enableMemory}
                onChange={(e) => setEnableMemory(e.target.checked)}
                name="Enable Memory"
              />
            }
            label="Enable Memory"
          />
        </>
      )}
    </>
  );
}

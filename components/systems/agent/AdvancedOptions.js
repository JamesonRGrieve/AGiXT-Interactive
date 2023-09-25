import { TextField, FormControlLabel, Switch } from "@mui/material";

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
  fullWidth = true,
}) {
  return (
    <>
      <TextField
        fullWidth={fullWidth}
        type="number"
        label="Inject Memories from Collection"
        value={injectMemoriesFromCollectionNumber}
        onChange={(e) => setInjectMemoriesFromCollectionNumber(e.target.value)}
        sx={{ mb: fullWidth ? 1 : 2 }}
      />
      <TextField
        fullWidth={fullWidth}
        type="number"
        label="Memories to Inject"
        value={contextResults}
        onChange={(e) => setContextResults(e.target.value)}
        sx={{ mb: fullWidth ? 1 : 2 }}
      />
      <TextField
        fullWidth={fullWidth}
        label="Chat interactions to inject"
        type="number"
        min={0}
        max={100}
        step={1}
        value={conversationResults}
        onChange={(e) => setConversationResults(e.target.value)}
        sx={{ mb: fullWidth ? 1 : 2 }}
      />
      <TextField
        fullWidth={fullWidth}
        type="number"
        label="How many times to send the prompt"
        value={shots}
        onChange={(e) => setShots(e.target.value)}
        sx={{ mb: fullWidth ? 1 : 2 }}
      />

      <br />

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
      {websearch && (
        <TextField
          fullWidth={fullWidth}
          type="number"
          label="How many links to browse"
          value={websearchDepth}
          onChange={(e) => setWebsearchDepth(e.target.value)}
          sx={{ mb: fullWidth ? 1 : 2 }}
        />
      )}
      <FormControlLabel
        control={
          <Switch
            checked={enableMemory}
            onChange={(e) => setEnableMemory(e.target.checked)}
            name="Enable Memory Training"
          />
        }
        label="Enable Memory Training"
      />
    </>
  );
}

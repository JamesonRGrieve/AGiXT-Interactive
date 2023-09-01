import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

export default function ConversationSelector({
  conversations,
  conversationName,
  setConversationName,
}) {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id="conversation-label">Select a Conversation</InputLabel>
      <Select
        labelId="conversation-label"
        fullWidth
        label="Select a Conversation"
        value={conversationName}
        onChange={(e) => setConversationName(e.target.value)}
      >
        {conversations
          ? conversations.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))
          : null}
      </Select>
    </FormControl>
  );
}

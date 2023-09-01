import { Select, MenuItem, Typography } from "@mui/material";

export default function ConversationSelector({
  conversations,
  conversationName,
  setConversationName,
}) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Select a Conversation
      </Typography>

      <Select
        fullWidth
        label="Conversation"
        value={conversationName}
        onChange={(e) => setConversationName(e.target.value)}
        sx={{ mb: 2 }}
      >
        {conversations
          ? conversations.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))
          : []}
      </Select>
    </>
  );
}

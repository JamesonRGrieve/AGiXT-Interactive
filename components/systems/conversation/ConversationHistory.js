import { Paper, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

export default function ConversationHistory({ chatHistory }) {
  return (
    <Paper
      elevation={5}
      sx={{
        padding: "0.5rem",
        overflowY: "auto",
        height: "58vh",
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      <div style={{ width: "100%" }}>
        {chatHistory.map((chatItem, index) => (
          <ChatMessage key={index} chatItem={chatItem} />
        ))}
      </div>
    </Paper>
  );
}

const ChatMessage = ({ chatItem }) => {
  return (
    <div
      style={{
        marginBottom: "10px",
        display: "flex",
        flexDirection: chatItem.role === "USER" ? "row-reverse" : "row",
        justifyContent: chatItem.role === "USER" ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          borderRadius: "15px",
          padding: "10px",
          marginBottom: "5px",
          overflow: "hidden",
          border: "2px solid black",
        }}
      >
        <ReactMarkdown>{chatItem.message}</ReactMarkdown>
      </div>

      <Typography
        variant="caption"
        style={{
          alignSelf: "flex-end",
          marginLeft: chatItem.role === "USER" ? "10px" : 0,
          marginRight: chatItem.role === "USER" ? 0 : "10px",
          color: "#a3a3a3",
        }}
      >
        {chatItem.role === "USER" ? "You" : chatItem.role} •{" "}
        {chatItem.timestamp}
      </Typography>
    </div>
  );
};

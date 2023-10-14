import AgentPrompt from "../components/systems/agent/AgentPrompt";
export default function Home() {
  return (
    <AgentPrompt
      agentName={"gpt4free"} // Agent name
      mode={"prompt"} // Modes are prompt or chain
      conversationName={"Test"}
      enableFileUpload={false} // Enable file upload button
      promptName={"Chat"} // Only matters if mode is prompt
      promptCategory={"Default"} // Only matters if mode is prompt
      selectedChain={"Smart Chat"} // Only matters if mode is chain
      chainArgs={[]} // Only matters if mode is chain, these are chain arg overrides
    />
  );
}

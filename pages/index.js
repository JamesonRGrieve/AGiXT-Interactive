import AGiXTChat from "../components/systems/agent/AGiXTChat";
export default function Home() {
  return (
    <AGiXTChat
      agentName={"gpt4free"} // Agent name
      mode={"prompt"} // Modes are prompt or chain
      conversationName={"Convert Extensions to new ones"}
      enableFileUpload={false} // Enable file upload button
      promptName={"Chat"} // Only matters if mode is prompt
      promptCategory={"Default"} // Only matters if mode is prompt
      selectedChain={"Smart Chat"} // Only matters if mode is chain
      chainArgs={[]} // Only matters if mode is chain, these are chain arg overrides
      useSelectedAgent={true} // Only matters if mode is chain, this will force the selected agent to run all chain steps
    />
  );
}

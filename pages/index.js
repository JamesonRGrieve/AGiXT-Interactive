import AgentPrompt from "../components/systems/agent/AgentPrompt";
export default function Home() {
  return (
    <>
      <AgentPrompt
        chains={[]}
        selectedChain={"Smart Chat"}
        setSelectedChain={() => {}}
        chainArgs={[]}
        conversationName={"Test"}
      />
    </>
  );
}

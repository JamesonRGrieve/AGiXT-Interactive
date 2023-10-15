import AGiXTChat from "../components/AGiXTChat";
export default function Postgres({}) {
  return (
    <AGiXTChat
      agentName={"SQLExpert"}
      mode={"chain"}
      conversationName={"Postgres"}
      selectedChain={"Postgres Chat"}
      useSelectedAgent={true}
    />
  );
}

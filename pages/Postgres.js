import AGiXTChat from "../components/AGiXTChat";
export default function Postgres({}) {
  return (
    <AGiXTChat
      baseUri={"http://localhost:7437"}
      apiKey={""}
      agentName={"VeryHelpful.AI"}
      mode={"chain"}
      conversationName={"Postgres"}
      selectedChain={"Postgres Chat"}
      useSelectedAgent={true}
    />
  );
}

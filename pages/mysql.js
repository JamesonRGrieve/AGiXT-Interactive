import AGiXTChat from "../components/AGiXTChat";
export default function mysql({}) {
  return (
    <AGiXTChat
      baseUri={"http://localhost:7437"}
      apiKey={""}
      agentName={"SQLExpert"}
      mode={"chain"}
      conversationName={"MySQL"}
      selectedChain={"MySQL Chat"}
      useSelectedAgent={true}
    />
  );
}

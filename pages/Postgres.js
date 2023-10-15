import AGiXTChat from "../components/AGiXTChat";
export default function Postgres({ setPageTitle }) {
  setPageTitle("Postgres Chat");
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

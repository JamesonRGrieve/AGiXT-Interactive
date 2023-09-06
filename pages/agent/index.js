import { sdk } from "../../lib/apiClient";
import axios from "axios";
import useSWR from "swr";
import ReactMarkdown from "react-markdown";
import { Container } from "@mui/material";
import ContentSWR from "../../components/data/ContentSWR";
export default function Home() {
  const docs = useSWR(
    "docs/agent",
    async () =>
      (
        await axios.get(
          "https://raw.githubusercontent.com/Josh-XT/AGiXT/main/docs/2-Concepts/9-Agent%20Interactions.md"
        )
      ).data
  );

  return (
    <Container>
      <ContentSWR
        swr={docs}
        content={({ data }) => <ReactMarkdown>{data}</ReactMarkdown>}
      />
    </Container>
  );
}

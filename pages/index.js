import axios from "axios";
import useSWR from "swr";
import ReactMarkdown from "react-markdown";
import MarkdownBlock from "../components/data/MarkdownBlock";
import { Box } from "@mui/material";
export default function Home() {
  const readme = useSWR(
    "docs",
    async () =>
      (
        await axios.get(
          "https://raw.githubusercontent.com/Josh-XT/AGiXT/main/docs/README.md"
        )
      ).data
  );
  return (
    <Box
      sx={{
        padding: "1rem",
      }}
    >
      {!readme.isLoading && readme.data ? (
        <MarkdownBlock content={readme.data} />
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
}

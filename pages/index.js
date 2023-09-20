import axios from "axios";
import useSWR from "swr";
import MarkdownBlock from "../components/data/MarkdownBlock";
import { Box } from "@mui/system";
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
        padding: "10px",
        marginBottom: "5px",
        marginTop: "-30px",
        overflow: "hidden",
        position: "center",
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

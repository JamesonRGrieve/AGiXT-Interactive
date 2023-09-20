import axios from "axios";
import useSWR from "swr";
import MarkdownBlock from "../components/data/MarkdownBlock";
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
    <>
      {!readme.isLoading && readme.data ? (
        <MarkdownBlock content={readme.data} />
      ) : (
        <>Loading...</>
      )}
    </>
  );
}

import { useRouter } from "next/router";
import { sdk } from "../../lib/apiClient";
import useSWR from "swr";
import ContentSWR from "../../components/data/ContentSWR";
import PromptControl from "../../components/systems/prompt/PromptControl";
export default function Prompt() {
  const promptName = useRouter().query.prompt;
  // TODO: Need to define promptCategory from a selector rather than hard coding it.
  const promptCategories = useSWR(
    "promptCategory",
    async () => await sdk.getPromptCategories()
  );
  const promptCategory = "Default";
  const prompt = useSWR(
    `prompt/${promptName}`,
    async () => await sdk.getPrompt(promptName, promptCategory)
  );
  // TODO: Selecting a prompt is not showing it an edit prompt UI like it should.
  return <ContentSWR swr={prompt} content={PromptControl} />;
}

import { useRouter } from "next/router";
import { sdk } from "../../lib/apiClient";
import useSWR from "swr";
import ContentSWR from "@/components/data/ContentSWR";
import PromptControl from "@/components/systems/prompt/PromptControl";
export default function Prompt() {
  const promptName = useRouter().query.prompt;
  const prompt = useSWR(
    `prompt/${promptName}`,
    async () => await sdk.getPrompt(promptName)
  );
  return <ContentSWR swr={prompt} content={PromptControl} />;
}

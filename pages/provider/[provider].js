import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";
import ContentSWR from "../../components/data/ContentSWR";
import PopoutDrawerWrapper from "../../components/menu/PopoutDrawerWrapper";
import ProviderList from "../../components/systems/provider/ProviderList";
import { Container } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { sdk } from "../../lib/apiClient";

function getProviderName(provider) {
  switch (provider) {
    case "gpt4free":
      return "GPT4Free";
    case "azure":
      return "Azure OpenAI";
    case "chatgpt":
      return "ChatGPT";
    case "poe":
      return "Poe";
    case "oobabooga":
      return "Oobabooga Text Generation Web UI";
    case "openai":
      return "OpenAI";
    case "huggingface":
      return "Hugging Face Transformers";
    case "fastchat":
      return "FastChat";
    case "palm":
      return "Google Palm";
    case "claude":
      return "Anthropic Claude";
    case "huggingchat":
      return "HuggingChat";
    case "llamacppapi":
      return "llamacpp API";
    case "kobold":
      return "Kobold";
    case "llamacpp":
      return "llamacpp";
    case "custom":
      return "Custom OpenAI Style Provider";
    case "bard":
      return "Google Bard";
    default:
      return "Custom OpenAI Style Provider"; // return the original name if there's no match
  }
}

export default function Provider() {
  const providerName = useRouter().query.provider;
  const docs = useSWR(
    `docs/provider/${providerName}`,
    async () =>
      (
        await axios.get(
          `https://raw.githubusercontent.com/Josh-XT/AGiXT/main/docs/3-Providers/${getProviderName(
            providerName
          )}.md`
        )
      ).data
  );
  const providers = useSWR("provider", async () => await sdk.getProviders());
  return (
    <PopoutDrawerWrapper
      title={"Provider Homepage"}
      leftHeading={"Providers"}
      leftSWR={providers}
      leftMenu={ProviderList}
      rightHeading={null}
      rightSWR={null}
      rightMenu={null}
    >
      <Container>
        <ContentSWR
          swr={docs}
          content={({ data }) => <ReactMarkdown>{data}</ReactMarkdown>}
        />
      </Container>
    </PopoutDrawerWrapper>
  );
}

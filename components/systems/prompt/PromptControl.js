import { useRouter } from "next/router";
import useSWR from "swr";
import PromptPanel from "./PromptPanel";
import PopoutDrawerWrapper from "../../menu/PopoutDrawerWrapper";
import PromptList from "./PromptList";
import { sdk } from "../../../lib/apiClient";
export default function PromptControl({ data }) {
  const promptName = useRouter().query.prompt;
  // TODO: Need to define promptCategory from a selector rather than hard coding it.
  const promptCategory = "Default";
  const prompts = useSWR(
    "prompt",
    async () => await sdk.getPrompts(promptCategory)
  );
  return (
    <PopoutDrawerWrapper
      title={'Manage Prompt "' + promptName + '"'}
      leftHeading={"Prompts"}
      leftSWR={prompts}
      leftMenu={PromptList}
      rightHeading={null}
      rightSWR={null}
      rightMenu={null}
    >
      <PromptPanel />
    </PopoutDrawerWrapper>
  );
}

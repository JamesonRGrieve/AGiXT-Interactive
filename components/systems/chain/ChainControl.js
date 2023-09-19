import { useRouter } from "next/router";
import { sdk } from "../../../lib/apiClient";
import useSWR from "swr";
import ChainPanel from "../chain/ChainPanel";
import PopoutDrawerWrapper from "../../menu/PopoutDrawerWrapper";
import ChainList from "./ChainList";
export default function ChainControl({ data, commands }) {
  const chainName = useRouter().query.chain;
  const chains = useSWR("chain", async () => await sdk.getChains());
  return (
    <PopoutDrawerWrapper
      title={'Manage Chain "' + chainName + '"'}
      leftHeading={"Chains"}
      leftSWR={chains}
      leftMenu={ChainList}
      rightHeading={null}
      rightSWR={null}
      rightMenu={null}
    >
      <ChainPanel commands={commands} />
    </PopoutDrawerWrapper>
  );
}

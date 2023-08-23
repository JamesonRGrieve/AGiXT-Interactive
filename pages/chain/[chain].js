import { useRouter } from "next/router";
import useSWR from "swr";
import ContentSWR from "../../components/data/ContentSWR";
import ChainControl from "../../components/systems/chain/ChainControl";
import { sdk } from "../../lib/apiClient";
export default function Chain() {
  const chainName = useRouter().query.chain;
  const chain = useSWR(
    `chain/${chainName}`,
    async () => await sdk.getChain(chainName)
  );
  return <ContentSWR swr={chains} content={ChainControl} />;
}

import { useRouter } from "next/router";
import TrainPanel from "../../components/systems/train/TrainPanel";
export default function Train({
  collectionNumber = 0,
  limit = 10,
  minRelevanceScore = 0.0,
}) {
  const router = useRouter();
  return (
    <TrainPanel
      collectionNumber={collectionNumber}
      limit={limit}
      minRelevanceScore={minRelevanceScore}
    />
  );
}

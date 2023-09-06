import { useRouter } from "next/router";
import TrainPanel from "../../components/systems/train/TrainPanel";
export default function Train() {
  const router = useRouter();
  return <TrainPanel />;
}

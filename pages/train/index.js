import { useRouter } from "next/router";
import TrainControl from "../../components/systems/train/TrainControl";
export default function Train() {
  const router = useRouter();
  return <TrainControl />;
}

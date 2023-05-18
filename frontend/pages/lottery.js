import { useMoralis } from "react-moralis";
import LotteryEntrance from "../components/LotteryEntrance";

export default function Lottery() {
    const { isWeb3Enabled } = useMoralis();

    return <div className="px-4 py-4 container mx-auto">{isWeb3Enabled && <LotteryEntrance />}</div>;
}

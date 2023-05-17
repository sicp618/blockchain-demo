import { useMoralis, useWeb3Contract } from "react-moralis";
import contractAddress from "../constants/contractAddresses.json";
import contractABI from "../constants/contractAbi.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";
import Link from "next/link";

export default function LotteryEntrance() {
    const dispatch = useNotification();
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress =
        chainId in contractAddress ? contractAddress[chainId][0] : null;
    console.log(
        `The raffle address is ${raffleAddress} ${chainId} ${JSON.stringify(
            contractAddress
        )}`
    );

    const [price, setPrice] = useState("0");
    const [recentWinner, setRecentWinner] = useState("");

    const { runContractFunction: getPrice } = useWeb3Contract({
        abi: contractABI,
        contractAddress: raffleAddress,
        functionName: "getPrice",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: contractABI,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    });

    const { runContractFunction: buyLottery } = useWeb3Contract({
        abi: contractABI,
        contractAddress: raffleAddress,
        functionName: "buyLottery",
        msgValue: price,
        params: {},
    });

    const handleSuccess = async (tx) => {
        await tx.wait(1);
        handleNewNotification(tx);
    };

    const handleNewNotification = async (tx) => {
        dispatch({
            type: "info",
            message: "Transaction successful!",
            title: "Transaction",
            position: "topR",
            icon: "bell",
        });
    };

    async function updateUI() {
        setPrice((await getPrice()).toString());
        setRecentWinner(await getRecentWinner());
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled, recentWinner]);

    return (
        <div className="ml-8">
            <h1 className="mt-4">
                {ethers.utils.formatUnits(price, "ether")} ETH 抽一次，抽取 2
                次后会将 0.02 ETH 随机返回给一个抽奖者
            </h1>
            <div className="mt-2">
                <Link
                    className="text-blue-500 hover:text-blue-700"
                    href={`https://sepolia.etherscan.io/address/${raffleAddress}`}
                    target="_blank"
                >
                    合约地址
                </Link>
            </div>
            <h1 className="mt-4"></h1>
            <div className="mt-2">
                <h1>最近获奖者</h1>
                <Link
                    className="text-blue-500 hover:text-blue-700 mt-2"
                    href={`https://sepolia.etherscan.io/address/${recentWinner}`}
                    target="_blank"
                >
                    {recentWinner}
                </Link>
            </div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white mt-4 font-bold py-2 px-4 rounded ml-auto"
                onClick={async () => {
                    const r = await buyLottery({
                        onSuccess: handleSuccess,
                        onError: (e) => console.log(e),
                    });
                }}
            >
                抽一把
            </button>
        </div>
    );
}

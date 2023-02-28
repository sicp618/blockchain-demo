import { useMoralis, useWeb3Contract } from "react-moralis";
import { contractAddress, contractABI } from "../constants";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
  const dispatch = useNotification();
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;

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
    functionName: "getRecnetWinner",
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
      <h1 className="mt-4">最近获胜者 {recentWinner}</h1>
      <h1 className="mt-2">
        抽奖金额 {ethers.utils.formatUnits(price, "ether")}ETH
      </h1>
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

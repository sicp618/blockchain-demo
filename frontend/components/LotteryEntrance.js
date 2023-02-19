import {useMoralis, useWeb3Contract} from "react-moralis";
import {contractAddress, contractABI} from "../constants"
import {useEffect, useState} from "react";
import {ethers} from "ethers"
import {useNotification} from "web3uikit";

export default function LotteryEntrance() {
    const dispatch = useNotification()
    const {chainId: chainIdHex, isWeb3Enabled} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    const [price, setPrice] = useState("0")

    const {runContractFunction: getPrice} = useWeb3Contract({
        abi: contractABI,
        contractAddress: raffleAddress,
        functionName: "getPrice",
        msgValue: price,
        params: {},
    })

    const {runContractFunction: buyRaffle} = useWeb3Contract({
        abi: contractABI,
        contractAddress: raffleAddress,
        functionName: "buyRaffle",
        msgValue: price,
        params: {}
    })

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
    }

    const handleNewNotification = async (tx) => {
        dispatch({
            type: "info",
            message: "Transaction successful!",
            title: "Transaction",
            position: "topR",
            icon: "bell",
        })
    }

    async function updateUI() {
        setPrice((await getPrice()).toString())
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    console.log(`chainId ${chainId}`)
    return (
        <div>
            <h1>Lottery price {ethers.utils.formatUnits(price, "ether")}</h1>
            <button onClick={async () => {
                await buyRaffle({
                    onSuccess: handleSuccess,
                })
            }}>Buy
            </button>
        </div>
    )
}
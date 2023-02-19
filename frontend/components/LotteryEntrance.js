import {useMoralis, useWeb3Contract} from "react-moralis";
import {contractAddress, contractABI} from "../constants"
import {useEffect, useState} from "react";
import {ethers} from "ethers"

export default function LotteryEntrance() {

    // const { runContractFunction } = useWeb3Contract(
    //     abi:,
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
        messageValue: price,
        params: {}
    })

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
        </div>
    )
}
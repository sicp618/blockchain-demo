import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import nftAbi from "../constants/BasicNft.json";
import Image from "next/image";
import { Card, useNotification } from "web3uikit";
import { ethers } from "ethers";
import UpdateListingModal from "./UpdateListingModal";

export default function NFTDetail({ address, tokenId, from, to }) {
    const { isWeb3Enabled, account } = useMoralis();
    const [imageURI, setImageURI] = useState("");
    const [tokenName, setTokenName] = useState("");
    const [tokenDescription, setTokenDescription] = useState("");

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: address,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    });

    async function updateUI() {
        const tokenURI = await getTokenURI();
        console.log(`The TokenURI is ${tokenURI}`);
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
            const tokenURIResponse = await (await fetch(requestURL)).json();
            const imageURI = tokenURIResponse.image;
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
            setImageURI(imageURIURL);
            setTokenName(tokenURIResponse.name);
            setTokenDescription(tokenURIResponse.description);
        }
    }

    useEffect(() => {
        console.log(`useEffect isWeb3Enabled is ${isWeb3Enabled}`);
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    return (
        <div className="mr-4 mb-4">
            <div className="flex flex-col gap-2">
                {imageURI ? (
                    <div>
                        <Card id={tokenId} title={tokenName} description={tokenDescription}>
                            <div className="p-2 items-end flex flex-col">
                                <div>#{tokenId}</div>
                                <Image src={imageURI} width={200} height={200} loader={() => imageURI} alt="" />
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
}

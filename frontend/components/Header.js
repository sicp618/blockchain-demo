import { ConnectButton } from "web3uikit";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

export default function Header() {
    const { isWeb3Enabled, account, chainId } = useMoralis();
    const [pickType, setPickType] = useState("nft");

    return (
        <div>
            <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
                <h1 className="py-4 px-4 font-bold text-3xl">
                    Sepolia Only
                </h1>
                <div className="flex flex-row items-center">
                    <Link href="/">
                        <a
                            className="mr-4 p-6"
                            onClick={() => setPickType("nft")}
                        >
                            NFT
                        </a>
                    </Link>
                    <Link href="/lottery">
                        <a
                            className="mr-4 p-6"
                            onClick={() => setPickType("lottery")}
                        >
                            Lottery
                        </a>
                    </Link>
                    <ConnectButton moralisAuth={false} />
                </div>
            </nav>
            {pickType == "nft" && (
                <nav className="p-5 flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center">
                        <Link href="/">
                            <a className="mr-4 p-2 ml-4">Market</a>
                        </Link>
                        <Link href="/sell-nft">
                            <a className="mr-4 p-2">Sell NFT</a>
                        </Link>
                        <Link href="/my-nfts">
                            <a className="mr-4 p-2">My NFTs</a>
                        </Link>
                    </div>
                </nav>
            )}
        </div>
    );
}

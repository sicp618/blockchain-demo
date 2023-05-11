import styles from "../styles/Home.module.css";
import { useMoralisQuery, useMoralis } from "react-moralis";
import NFTBox from "../components/NFTBox";
import networkMapping from "../constants/networkMapping.json";
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";
import { useQuery } from "@apollo/client";
import queryUserNfts from "../constants/cubeNftGraphQueries";
import NFTDetail from "../components/NFTDetail";

export default function MyNFTs() {
    const { chainId, isWeb3Enabled } = useMoralis();
    const chainString = chainId ? parseInt(chainId).toString() : null;
    const nftAddress = chainId ? networkMapping[chainString].CubeNft[0] : null;

    // let userAddress = "0x33acbE339D610dA8943f1143257d97740aDA0d4E";
    // const { loading, error, data: listedNfts } = useQuery(queryUserNfts(userAddress));
    const { loading, error, data: ntfs } = useQuery(queryUserNfts);
    console.log("listedNfts ", loading, nftAddress, error, ntfs);

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">My NFTs</h1>
            <div className="px-4 flex flex-wrap">
                {isWeb3Enabled && chainId ? (
                    loading || !ntfs ? (
                        <div>Loading...</div>
                    ) : (
                        ntfs.nftInfos.map((nft) => {
                            const { from, to, tokenId } = nft;
                            return (
                                <NFTDetail
                                    from={from}
                                    to={to}
                                    tokenId={tokenId}
                                    address={nftAddress}
                                    key={tokenId}
                                />
                            );
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    );
}

import styles from "../styles/Home.module.css";
import { useMoralisQuery, useMoralis } from "react-moralis";
import NFTBox from "../components/NFTBox";
import networkMapping from "../constants/networkMapping.json";
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";
import { useQuery } from "@apollo/client";
import queryUserNfts from "../constants/cubeNftGraphQueries";
import NFTDetail from "../components/NFTDetail";

export default function MyNFTs() {
    const { chainId, isWeb3Enabled, account } = useMoralis();
    const chainString = chainId ? parseInt(chainId).toString() : null;
    const nftAddress = chainId ? networkMapping[chainString].CubeNft[0] : null;

    const {
        loading,
        error,
        data: ntfs,
    } = useQuery(queryUserNfts, {
        variables: { account },
    });

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
                                <NFTDetail from={from} to={to} tokenId={tokenId} address={nftAddress} key={tokenId} />
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

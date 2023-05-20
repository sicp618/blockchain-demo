import { useQuery, gql } from "@apollo/client";

const queryUserNfts = gql`
    query ($account: String!) {
        nftInfos(first: 5, where: { to: $account }) {
            id
            from
            to
            tokenId
        }
    }
`;

export default queryUserNfts;

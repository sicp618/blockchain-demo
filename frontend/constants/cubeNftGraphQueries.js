import { useQuery, gql } from "@apollo/client";

// export default function queryUserNfts(userAddress) {
//     return gql`
//         {
//             nftInfos(first: 5, where: { to: "0x33acbE339D610dA8943f1143257d97740aDA0d4E" }) {
//                 id
//                 from
//                 to
//                 tokenId
//             }
//         }
//     `;
// }

const queryUserNfts = gql`
    {
        nftInfos(first: 5, where: { to: "0x33acbE339D610dA8943f1143257d97740aDA0d4E" }) {
            id
            from
            to
            tokenId
        }
    }
`;

export default queryUserNfts;

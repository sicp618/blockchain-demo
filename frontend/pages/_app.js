import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import Head from "next/head";
import { NotificationProvider } from "web3uikit";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL || "https://api.studio.thegraph.com/query/46023/sepolia-nft-market2/v0.0.3",
});

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    <ApolloProvider client={client}>
                        <Header />
                        <Component {...pageProps} />
                    </ApolloProvider>
                </NotificationProvider>
            </MoralisProvider>
        </div>
    );
}

export default MyApp;

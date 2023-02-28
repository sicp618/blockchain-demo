import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import styles from "@/styles/Home.module.css";
import LotteryEntrance from "@/components/LotteryEntrance";
import { useMoralis } from "react-moralis";

export default function Home() {
  const { isWeb3Enabled } = useMoralis();
  return (
    <div className={styles.container}>
      <Head>
        <title>合约 Demo</title>
        <meta name="description" content="demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {isWeb3Enabled ? (
        <LotteryEntrance />
      ) : (
        <div className="ml-8 mt-4">请连接钱包</div>
      )}
    </div>
  );
}

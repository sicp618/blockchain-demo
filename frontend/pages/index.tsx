import Head from 'next/head'
import Image from 'next/image'
import Header from "../components/Header"
import {Inter} from '@next/font/google'
import styles from '@/styles/Home.module.css'
import LotteryEntrance from "@/components/LotteryEntrance";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    return (
        <div>
            <Head>
                <title>Create Next App</title>
            </Head>
            <Header />
            <LotteryEntrance />
        </div>
    )
}

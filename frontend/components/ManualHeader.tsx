import {useMoralis} from "react-moralis";
import {useEffect} from "react"

export default function ManualHeader() {
    const {enableWeb3, account, isWeb3Enabled, Moralis,
        deactivateWeb3, isWeb3EnableLoading} = useMoralis()
    useEffect(() => {
        console.log("isWeb3Enabled", isWeb3Enabled)
        if (typeof window !== 'undefined') {
            if (window.localStorage.getItem("connected") === "inject") {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged(() => {
            console.log(`account changed to ${account}`)
            if (typeof window == null) {
                window.localStorage.removeItem("connected")
            }
        })
    }, [])
    return (
        <div>
            {account ? (<div>Connected to {account}</div>) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== 'undefined') {
                            window.localStorage.setItem("connected", "inject")
                        }
                    }}
                    disabled={isWeb3EnableLoading}>连接钱包
                </button>)
            }
        </div>)
}

const { ethers, network, run } = require("hardhat")
const {
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

async function deployNftMarket(chainId) {
    //set log level to ignore non errors
    ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR)

    const accounts = await ethers.getSigners()
    const deployer = accounts[0]

    const marketFactory = await ethers.getContractFactory("NftMarket")
    nftMarket = await marketFactory.deploy()

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS
    await nftMarket.deployTransaction.wait(waitBlockConfirmations)

    console.log(`nftMarket deployed to ${nftMarket.address} on ${network.name}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await run("verify:verify", {
            address: nftMarket.address,
            constructorArguments: [],
        })
    }
}

module.exports = {
    deployNftMarket,
}

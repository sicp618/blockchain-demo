const { ethers, network, run } = require("hardhat")
const {
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

async function deployCubeNft(chainId) {
    //set log level to ignore non errors
    ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR)

    const accounts = await ethers.getSigners()
    const deployer = accounts[0]

    const marketFactory = await ethers.getContractFactory("CubeNft")
    cubeNft = await marketFactory.deploy()

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS
    await cubeNft.deployTransaction.wait(waitBlockConfirmations)

    console.log(`cubeNft deployed to ${cubeNft.address} on ${network.name}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await run("verify:verify", {
            address: cubeNft.address,
            constructorArguments: [],
        })
    }
}

module.exports = {
    deployCubeNft,
}

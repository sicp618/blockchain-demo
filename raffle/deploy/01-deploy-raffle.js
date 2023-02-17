const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("150")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId

    let vrfCoordinatorV2Address, subId
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transcationResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transcationResponse.wait()
        subId = transactionReceipt.events[0].args.subId

        await vrfCoordinatorV2Mock.fundSubscription(subId, VRF_SUB_FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subId = networkConfig[chainId]["subId"]
    }

    const price = networkConfig[chainId]["price"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const interval = networkConfig[chainId]["interval"]
    const args = [vrfCoordinatorV2Address, price, gasLane, subId, callbackGasLimit, interval]
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmation: network.config.blockConfirmations || 1,
    })

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        await vrfCoordinatorV2Mock.addConsumer(subId, raffle.address)
    }

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying Raffle contract...")
        await verify(raffle.address, args)
    }
}

module.exports.tags = ["all", "raffle"]
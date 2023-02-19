const { ethers, network} = require("hardhat")
const fs = require("fs")

const FRONTEND_ADDRESS_FILE = "../frontend/constants/contractAddresses.json"
const FRONTEND_ABI_FILE = "../frontend/constants/contractAbi.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONTEND) {
        console.log("Updating frontend...")
        updateContractAddresses()
        updateAbi()
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    const abi = raffle.interface.format(ethers.utils.FormatTypes.json, "Raffle")
    fs.writeFileSync(FRONTEND_ABI_FILE, abi)
}

async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    const chainId = await network.config.chainId.toString()
    const currentAddress = JSON.parse(fs.readFileSync(FRONTEND_ADDRESS_FILE, "utf8"))
    console.log(`update chainId ${chainId} to ${currentAddress}`)
    if (chainId in currentAddress) {
        if (!currentAddress[chainId].includes(raffle.address)) {
            currentAddress[chainId].push(raffle.address)
        } else {
            currentAddress[chainId] = raffle.address
        }
    }
    fs.writeFileSync(FRONTEND_ADDRESS_FILE, JSON.stringify(currentAddress))
}

module.exports.tags = ["all", "frontend"]

const { task } = require("hardhat/config")

task("block-number", "Prints the current block number").setAction(
    async (taskArgs, hre) => {
        const bn = await hre.ethers.provider.getBlockNumber()
        console.info(`cure ${bn}`)
    }
)

module.exports = {}
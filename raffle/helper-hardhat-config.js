const { ethers } = require("hardhat")

const networkConfig = {
    4: {
        name: "goerli",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        price: ethers.utils.parseEther("0.01"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subId: "0",
        callbackGasLimit: "500000",
        interval: "30",
        numberOfPeople: "2",
    },
    31337: {
        name: "hardhat",
        price: ethers.utils.parseEther("0.01"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        callbackGasLimit: "500000",
        interval: "30",
        numberOfPeople: "2",
    }
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
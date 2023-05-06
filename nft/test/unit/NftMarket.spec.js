const { network, ethers } = require("hardhat")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { networkConfig, developmentChains } = require("../../helper-hardhat-config")
const { numToBytes32 } = require("../../helper-functions")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Nft Market Unit Tests", async () => {
        let nftMarket, nft, nftMarketContract, nftContact
        const PRICE = ethers.utils.parseEther("0.1")
        const TOKENID = 0

        beforeEach(async () => {
            accounts = await ethers.getSigners()
            deployer = accounts[0]
            user = accounts[1]
            nftMarketContract = await ethers.getContractFactory("NftMarket")
            nftMarket = await nftMarketContract.connect(deployer).deploy()
            nftContract = await ethers.getContractFactory("CubeNft")
            nft = await nftContract.connect(deployer).deploy()
            await nft.mintNft()
            await nft.approve(nftMarket.address, TOKENID)
        })
        
        describe("listItem", () => {
            it("emit ListItem event", async function() {
                await expect(nftMarket.listItem(nft.address, TOKENID, PRICE))
                    .to.emit(nftMarket, "ItemListed")
            })
        })
    })

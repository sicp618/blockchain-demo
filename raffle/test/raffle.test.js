const { developmentChains } = require("../helper-hardhat-config")
const { assert, expect } = require("chai")
const { ethers, deployments, getNamedAccounts } = require("hardhat")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", function () {
        let raffle, vrfCoordinatorV2Mock, price, deployPlayer
        beforeEach(async function () {
            const { deployer } = await getNamedAccounts()
            deployPlayer = deployer
            await deployments.fixture(["all"])
            raffle = await ethers.getContract("Raffle", deployer)
            vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            price = await raffle.getPrice()
        })

        describe("constructor", function () {
            it("initializes the contract", async function () {
                const raffleState = await raffle.getState()
                const interval = await raffle.getInterval()
                assert.equal(raffleState.toString(), "0")
                assert.equal(interval.toString(), "30")
            })
        })

        describe("enterRaffle", function () {
            it("revert not pay enough", async () => {
                await expect(raffle.buyRaffle()).to.be.revertedWithCustomError(
                    raffle,
                    "RaffleNotEnoughETH"
                )
            })
            it("record player", async () => {
                await raffle.buyRaffle({ value: price })
                const player = await raffle.getPlayer(0)
                assert.equal(player.address, deployPlayer.address)
            })
        })
    })

const { developmentChains } = require("../helper-hardhat-config")
const { assert, expect } = require("chai")
const { ethers, deployments, getNamedAccounts, network} = require("hardhat")
const { time } = require("@nomicfoundation/hardhat-network-helpers")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("RaffleByNumberOfPeople", function () {
        let raffle, vrfCoordinatorV2Mock, price, deployPlayer, numberOfPeople
        beforeEach(async function () {
            const { deployer } = await getNamedAccounts()
            deployPlayer = deployer
            await deployments.fixture(["all"])
            raffle = await ethers.getContract("RaffleByNumberOfPeople", deployer)
            vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
            price = await raffle.getPrice()
            numberOfPeople = await raffle.getNumberOfPeople()
        })

        describe("constructor", function () {
            it("initializes the contract", async function () {
                const raffleState = await raffle.getState()
                const price = await raffle.getPrice()
                assert.equal(raffleState.toString(), "0")
                assert.equal(ethers.utils.formatEther(price), "0.01")
            })
        })

        describe("buy lottery", function () {
            it("revert not pay enough", async () => {
                await expect(raffle.buyLottery()).to.be.revertedWithCustomError(
                    raffle,
                    "RaffleNotEnoughETH"
                )
            })
            it("record player", async () => {
                await raffle.buyLottery({ value: price })
                const player = await raffle.getPlayer(0)
                assert.equal(player.address, deployPlayer.address)
            })
            it("can't buy raffle when raffle is close", async () => {
                await raffle.buyLottery({ value: price })
                await raffle.buyLottery({ value: price })
                const players = await raffle.getPlayers()
                assert.equal(players.length, 2)
                await expect(raffle.buyLottery({ value: price })).to.be.revertedWithCustomError(
                    raffle,
                    "RaffleNotOpen"
                )
            })
        })

        describe("fulfillRandomWords", function() {
            it("next raffle", async () => {
                await new Promise(async (resolve, reject) => {
                    raffle.once("RaffleWinner", async ()=> {
                        try {
                            await raffle.buyLottery({ value: price })
                            await expect(raffle.buyLottery({ value: price })).to.be.emit(
                                raffle,
                                "RaffleBuyLottery"
                            )

                            resolve()
                        } catch (e) {
                            reject(e)
                        }
                    })

                    await raffle.buyLottery({ value: price })
                    const tx = await raffle.buyLottery({ value: price })
                    const txReceipt = await tx.wait(1)
    
                    await vrfCoordinatorV2Mock.fulfillRandomWords(
                        txReceipt.events[2].args.requestId,
                        raffle.address
                    )
                })
            })
        })
    })

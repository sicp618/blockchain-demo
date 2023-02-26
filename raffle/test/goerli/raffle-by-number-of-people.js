const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")
const { ethers, deployments, getNamedAccounts, network} = require("hardhat")
const { time } = require("@nomicfoundation/hardhat-network-helpers")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("RaffleByNumberOfPeople", function () {
        let raffle, price, deployPlayer, numberOfPeople
        beforeEach(async function () {
            const { deployer } = await getNamedAccounts()
            deployPlayer = deployer
            raffle = await ethers.getContract("RaffleByNumberOfPeople", deployer)
            price = await raffle.getPrice()
            numberOfPeople = await raffle.getNumberOfPeople()
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
                    assert.equal(1, await raffle.getPlayers().length)
                    await raffle.buyLottery({ value: price })
                })
            })
        })
    })
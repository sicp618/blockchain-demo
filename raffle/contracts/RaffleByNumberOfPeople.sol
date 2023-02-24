// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

error RaffleNotEnoughETH();
error RaffleTransferFailed();
error RaffleNotOpen(uint256);

contract RaffleByNumberOfPeople is VRFConsumerBaseV2 {
    enum State {
        OPEN,
        CLOSE
    }

    State private state;
    uint256 private immutable price;
    address payable[] private players;
    uint256 private immutable number;
    address private recentWinner;

    event RaffleBuyLottery(address indexed player);
    event RequestVRFRandomWords(uint256 indexed requestId);
    event RaffleWinner(address indexed winner);

    // VRF Variables
    VRFCoordinatorV2Interface private vrf;
    uint64 private vrfSubId;
    bytes32 private vrfKeyHash;
    uint16 private VRF_MIN_REQUEST_CONFIRMATIONS = 3;
    uint32 private vrfCallbackGasLimit = 100000;
    uint32 private constant VRF_NUM_WORDS = 1;

    constructor(
        address vrfAddress,
        bytes32 keyHash,
        uint64 subId,
        uint32 callbackGasLimit,
        uint256 lotteryPrice,
        uint256 numberOfPeople
    ) VRFConsumerBaseV2(vrfAddress) {
        vrf = VRFCoordinatorV2Interface(vrfAddress);
        vrfKeyHash = keyHash;
        vrfSubId = subId;
        vrfCallbackGasLimit = callbackGasLimit;

        price = lotteryPrice;
        number = numberOfPeople;
        state = State.OPEN;
    }

    function buyLottery() public payable {
        if (state != State.OPEN) {
            revert RaffleNotOpen(uint256(state));
        }

        if (msg.value < price) {
            revert RaffleNotEnoughETH();
        }
        players.push(payable(msg.sender));
        emit RaffleBuyLottery(msg.sender);

        if (players.length < number) {
            return;
        }

        state = State.CLOSE;
        uint256 requestId = vrf.requestRandomWords(
            vrfKeyHash,
            vrfSubId,
            VRF_MIN_REQUEST_CONFIRMATIONS,
            vrfCallbackGasLimit,
            VRF_NUM_WORDS
        );
        emit RequestVRFRandomWords(requestId);
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function getPlayer(uint256 index) public view returns (address payable) {
        return players[index];
    }

    function getPrice() public view returns (uint256) {
        return price;
    }

    function getNumberOfPeople() public view returns (uint256) {
        return number;
    }

    function getState() public view returns (State) {
        return state;
    }

    function fulfillRandomWords(
        uint256 /* requestId */,
        uint256[] memory randomWords
    ) internal override {
        uint256 winnerIndex = randomWords[0] % players.length;
        address payable winner = players[winnerIndex];
        recentWinner = winner;
        players = new address payable[](0);
        state = State.OPEN;

        (bool success, ) = winner.call{value: address(this).balance}("");
        if (!success) {
            revert RaffleTransferFailed();
        }
        emit RaffleWinner(winner);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

error RaffleNotEnough();
    error RaffleNotOpen();
error RaffleTransferFailed();
error RaffleUpkeepNotNeeded();

contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    uint256 immutable private price;
    address payable[] players;
    RaffleState private raffleState;

    VRFCoordinatorV2Interface private immutable vrfCoordinator;
    bytes32 private immutable gasLane;
    uint64 private immutable subId;
    uint32 private immutable callbackGasLimit;
    uint16 private immutable MIN_REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable NUM_WORDS = 1;

    uint256 private beginTime;
    uint256 private immutable interval;

    event RaffleBuy(address indexed player);
    event RequestedRaffleWinner(uint256 indexed player);
    event WinnerPicked(address indexed player);

    constructor(
        address vrfV2,
        uint256 _price,
        bytes32 _gasLane,
        uint64 _subId,
        uint32 _callbackGasLimit,
        uint256 _openTime
    ) VRFConsumerBaseV2(vrfV2) {
        price = _price;
        vrfCoordinator = VRFCoordinatorV2Interface(vrfV2);
        gasLane = _gasLane;
        subId = _subId;
        callbackGasLimit = _callbackGasLimit;
        raffleState = RaffleState.OPEN;

        beginTime = block.timestamp;
        interval = _openTime;
    }

    function buyRaffle() public payable {
        if (msg.value < price) {
            revert RaffleNotEnough();
        }
        if (raffleState != RaffleState.OPEN) {
            revert RaffleNotOpen();
        }

        players.push(payable(msg.sender));
        emit RaffleBuy(msg.sender);
    }

    function getPlayer(uint256 index) public view returns (address) {
        return players[index];
    }

    function getState() public view returns (RaffleState) {
        return raffleState;
    }

    function getNumberWords() public pure returns (uint32) {
        return NUM_WORDS;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return players.length;
    }

    function fulfillRandomWords(uint256, uint256[] memory randomWords) internal override {
        uint256 winnerIndex = randomWords[0] % players.length;
        address payable winner = players[winnerIndex];

        raffleState = RaffleState.OPEN;
        players = new address payable[](0);
        beginTime = block.timestamp;

        (bool success, ) = winner.call{value: address(this).balance}("");
        if (!success) {
            revert RaffleTransferFailed();
        }
        emit WinnerPicked(winner);
    }

    function checkUpkeep(
        bytes memory /* checkData */
    ) public view override returns (bool /* upkeepNeeded */, bytes memory /* performData */) {
        bool isOpen = raffleState == RaffleState.OPEN;
        bool timePassed = (block.timestamp - beginTime) > interval;
        bool hasPlayers = players.length > 0;
        bool hasBalance = address(this).balance > 0;
        return (isOpen && timePassed && hasPlayers && hasBalance, "");
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert RaffleUpkeepNotNeeded();
        }

        raffleState = RaffleState.CALCULATING;

        uint256 requstId = vrfCoordinator.requestRandomWords(
            gasLane,
            subId, MIN_REQUEST_CONFIRMATIONS,
            callbackGasLimit, NUM_WORDS);
        emit RequestedRaffleWinner(requstId);
    }
}
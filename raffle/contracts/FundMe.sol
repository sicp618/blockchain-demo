// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

error NotOwner();

contract FundMe {

    address private immutable owner;

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address priceFeed) {
        owner = msg.sender;
    }
}

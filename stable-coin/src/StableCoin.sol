// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract StableCoin is ERC20, Ownable {

    uint256 public constant OWNER_INITIAL_TOKEN = 10000;
    constructor() ERC20("StableCoin", "SC") {
        _mint(msg.sender, OWNER_INITIAL_TOKEN);
    }
}

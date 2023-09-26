// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Initializable} from "@openzeppelin/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/access/Ownable.sol";
import {UUPSUpgradeable} from "@openzeppelin/proxy/utils/UUPSUpgradeable.sol";

contract CountDown is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public remainingTime;

    function initialize(uint256 _count) public initializer {
        count = _count;
    }

    function decrease() public {
        count--;
    }
}
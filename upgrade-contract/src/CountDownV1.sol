// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Initializable} from "@openzeppelin-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract CountDownV1 is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public remainingTime;

    constructor() {
        _disableInitializers();
    }

    function initialize(uint256 _count) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        remainingTime = _count;
    }

    function setRemainingTime(uint256 _count) public {
        remainingTime = _count;
    }

    function decrease() public {
        remainingTime--;
    }

    function get() public view returns (uint256) {
        return remainingTime;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Initializable} from "@openzeppelin-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract CountDownV2 is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public remainingTime;

    constructor() {
        _disableInitializers();
        remainingTime = 100;
    }

    function initialize(uint256 _count) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        remainingTime = _count;
    }

    function decrease() public returns (uint256) {
        if (remainingTime > 0) {
            remainingTime--;
        }

        return remainingTime;
    }

    function getTime() public view returns (uint256) {
        return remainingTime;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}

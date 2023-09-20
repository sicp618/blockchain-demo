// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {StableCoin} from "../src/StableCoin.sol";

contract StableCoinDeploy is Script {
    uint256 public deployPK;

    function setUp() public {}

    function run() public returns (StableCoin) {
        deployPK = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployPK);
        StableCoin sc = new StableCoin();
        vm.stopBroadcast();
        return sc;
    }
}
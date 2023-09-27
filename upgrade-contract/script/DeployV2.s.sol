// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "@forge-std/Script.sol";
import {CountDownV2} from "../src/CountDownV2.sol";
import {CountDownV1} from "../src/CountDownV1.sol";
import {ERC1967Proxy} from "@openzeppelin/proxy/ERC1967/ERC1967Proxy.sol";
import {DevOpsTools} from "@foundry-devops/DevOpsTools.sol";
import {UUPSUpgradeable} from "@openzeppelin-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract DeployV2 is Script {

    function run() external returns (address) {
        address proxy = DevOpsTools.get_most_recent_deployment("ERC1967Proxy", block.chainid);
        console2.log("get proxy", address(proxy));
        vm.startBroadcast();
        CountDownV2 countDown = new CountDownV2();
        vm.stopBroadcast();
        console2.log("deploy CountDownV2", address(proxy));

        return upgrade(proxy, address(countDown));
    }

    function upgrade(address proxy, address newImplementation) internal returns (address) {
        console2.log("upgrade start");
        vm.startBroadcast();
        UUPSUpgradeable(proxy).upgradeTo(newImplementation);
        vm.stopBroadcast();

        console2.log("upgrade success proxy ", proxy, " countDown ", newImplementation);
        return proxy;
    }
}
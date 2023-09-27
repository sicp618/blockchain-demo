// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "@forge-std/Script.sol";
import {CountDownV1} from "../src/CountDownV1.sol";
import {ERC1967Proxy} from "@openzeppelin/proxy/ERC1967/ERC1967Proxy.sol";
contract DeployV1 is Script {

    function run() external returns (address) {
        vm.startBroadcast();
        CountDownV1 countDown = new CountDownV1();
        ERC1967Proxy proxy = new ERC1967Proxy(address(countDown), "");
        vm.stopBroadcast();

        console2.log("proxy ", address(proxy), " countDown ", address(countDown));
        return address(proxy);
    }
}
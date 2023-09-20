// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {StableCoin} from "../src/StableCoin.sol";
import {Test, console2} from "forge-std/Test.sol";
import {StableCoinDeploy} from "../script/StableCoin.s.sol";

contract StableCoinTest is Test {
    StableCoin public stableCoin;
    address public user1;
    address public user2;
    address public deployAddr;

    uint256 private constant USER1_INITIAL_BALANCE = 40;
    uint256 private constant USER2_INITIAL_BALANCE = 60;

    function setUp() public {
        StableCoinDeploy deploy = new StableCoinDeploy();
        stableCoin = deploy.run();
        deployAddr = vm.addr(deploy.deployPK());
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        vm.startPrank(deployAddr);
        console2.log(stableCoin.balanceOf(deployAddr));
        stableCoin.transfer(user1, USER1_INITIAL_BALANCE);
        stableCoin.transfer(user2, USER2_INITIAL_BALANCE);
        vm.stopPrank();
    }

    function test_Balance() public {
        assertEq(stableCoin.balanceOf(deployAddr), stableCoin.OWNER_INITIAL_TOKEN() - USER1_INITIAL_BALANCE - USER2_INITIAL_BALANCE);
    }

    function test_Transfer() public {
        uint256 initialBalanceUser1 = stableCoin.balanceOf(user1);
        uint256 initialBalanceUser2 = stableCoin.balanceOf(user2);
        uint256 amount = 10;

        vm.startPrank(deployAddr);
        stableCoin.transfer(user1, amount);

        assertEq(stableCoin.balanceOf(user1), initialBalanceUser1 + amount);
        assertEq(stableCoin.balanceOf(user2), initialBalanceUser2);
        vm.stopPrank();
    }

    function test_TransferFrom() public {
        uint256 initialBalanceUser1 = stableCoin.balanceOf(user1);
        uint256 initialBalanceUser2 = stableCoin.balanceOf(user2);
        uint256 amount = 12;

        vm.startPrank(user1);
        stableCoin.approve(user1, amount);
        stableCoin.transferFrom(user1, user2, amount);
        vm.stopPrank();

        assertEq(stableCoin.balanceOf(user1), initialBalanceUser1 - amount);
        assertEq(stableCoin.balanceOf(user2), initialBalanceUser2 + amount);
    }

    function test_Allowance() public {
        uint256 allowanceAmount = 11;

        vm.startPrank(user1);
        stableCoin.approve(user2, allowanceAmount);
        vm.stopPrank();

        assertEq(stableCoin.allowance(address(user1), user2), allowanceAmount);
    }
}

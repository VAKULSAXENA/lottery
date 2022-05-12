// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.11;

contract Lottery {
    address public owner;
    address payable[] public players;

    constructor() {
        owner = msg.sender;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function enter() public payable {
        require(msg.value > 0.1 ether);
        players.push(payable(msg.sender));
    }

    function getRandomNumber() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(owner,block.timestamp)));
    }

    function pickWinner() public {
        require(msg.sender==owner,"Owner of Contract can Pick Winner");
        uint index = getRandomNumber() % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
    }
}
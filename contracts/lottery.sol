// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.11;
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Lottery is VRFConsumerBase {
    address public owner;
    address payable[] public players;
     bytes32 internal keyHash;
    uint internal fee;
    uint public randomResult;


    constructor()
        VRFConsumerBase(
            0x6168499c0cFfCaCD319c818142124B7A15E857ab, //VRF coordinator
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709  //LINK TOKEN ADDRESS                                                    // LINK TOKEN ADDRESS    
        ){
            owner = msg.sender;
            keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
            fee = 0.25 * 10 ** 18;     // 0.25 LINK
        }

        function getRandomNumber() public returns (bytes32 requestId) {
            require(LINK.balanceOf(address(this)) >= fee, "Insufficient LINK for Randomness");
            return requestRandomness(keyHash,fee);
        }

        function fulfillRandomness(bytes32 requestId,uint randomness) internal override {
            randomResult = randomness;
        }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function enter() public payable {
        require(msg.value > 0.1 ether);
        players.push(payable(msg.sender));
    }

    // function getRandomNumber() private view returns (uint) {
    //     return uint(keccak256(abi.encodePacked(owner,block.timestamp)));
    // }

    function pickWinner() public {
        require(msg.sender==owner,"Owner of Contract can Pick Winner");
        uint index = uint(getRandomNumber()) % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
    }
}
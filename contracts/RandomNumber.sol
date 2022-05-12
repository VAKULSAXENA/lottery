// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.11;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract RandomNumber is VRFConsumerBaseV2 {
    bytes32 internal keyHash;
    uint internal fee;
    uint public randomResult;

    constructor() {
        VRFConsumerBaseV2(
            0x6168499c0cFfCaCD319c818142124B7A15E857ab, //VRF coordinator
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709  //LINK TOKEN ADDRESS                                                    // LINK TOKEN ADDRESS    
        ){
            keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
            fee = 0.25 * 10 ** 18;     // 0.25 LINK
        }

    }
}

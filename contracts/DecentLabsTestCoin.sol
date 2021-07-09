// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DecentLabsTestCoin is ERC20 {
    address public owner;

    constructor() ERC20("DecentLabs", "DLC")  {
        // mint 100,000 DecentLabs Coins meant
         _mint(msg.sender, 1000000000000000000000000);
        owner= msg.sender;
    }
}
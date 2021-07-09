// SPDX-License-Identifier: MIT

pragma solidity =0.7.6;

import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol';
import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol';
import '@uniswap/v3-core/contracts/libraries/TickMath.sol';
import '@uniswap/v3-periphery/contracts/base/LiquidityManagement.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';
import "./interfaces/token/IWETH.sol";
import "hardhat/console.sol";

contract SeedLiquidity is ReentrancyGuard, LiquidityManagement {
    using SafeMath for uint256;

    address tokenAddr;
    address wethAddr = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address uniV3Factory = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    address uniV3Router = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    bool public isLiquidityInitialized = false;

    constructor(address _tokenAddr) PeripheryImmutableState(0x1F98431c8aD98523631AE4a59f267346ea31F984, 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2){
        tokenAddr = _tokenAddr;
        TransferHelper.safeApprove(tokenAddr, uniV3Router, 2**256-1);
        TransferHelper.safeApprove(wethAddr, uniV3Router, 2**256-1);
    }

    function initializeLiquidity(uint24 fee, int24 tickLower, int24 tickUpper, uint amount0, uint amount1, uint160 initialPrice) public {
        require(isLiquidityInitialized == false, "Liquidity already initialized");
        require(tickLower < tickUpper, "ITV");

        address pool = IUniswapV3Factory(uniV3Factory).getPool(tokenAddr, wethAddr, fee);
        if (pool == address(0)) {
            pool = IUniswapV3Factory(uniV3Factory).createPool(tokenAddr, wethAddr, fee);
            IUniswapV3Pool(pool).initialize(initialPrice);
        }

        if(amount0 > 0 && amount1 > 0){
            addLiquidity(AddLiquidityParams({
                token0: tokenAddr,
                token1: wethAddr,
                fee: fee,
                recipient: address(this),
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0Desired: amount0,
                amount1Desired: amount1,
                amount0Min: 0,
                amount1Min: 0
            }));
        }
        isLiquidityInitialized = true;
    }

    function add(uint24 fee, int24 tickLower, int24 tickUpper, uint amount0, uint amount1) public {
        require(isLiquidityInitialized == true, "Liquidity isn't initialized!");
        address pool = IUniswapV3Factory(uniV3Factory).getPool(tokenAddr, wethAddr, fee);
        if (amount0 > 0 && amount1 > 0 && pool != address(0)) {
            addLiquidity(AddLiquidityParams({
                token0: tokenAddr,
                token1: wethAddr,
                fee: fee,
                recipient: address(this),
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0Desired: amount0,
                amount1Desired: amount1,
                amount0Min: 0,
                amount1Min: 0
            }));

        }
    }

    function getPoolInfo(uint24 fee, int24 tickLower, int24 tickUpper) public{
        address pool = IUniswapV3Factory(uniV3Factory).getPool(tokenAddr, wethAddr, fee);
        if (pool != address(0)) {
            (uint160 sqrtPriceX96,
            int24 tick,
            uint16 observationIndex,
            uint16 observationCardinality,
            uint16 observationCardinalityNext,
            uint8 feeProtocol,
            bool unlocked) = IUniswapV3Pool(pool).slot0();
            uint128 liquidity = IUniswapV3Pool(pool).liquidity();
            console.log("sqrtPriceX96", sqrtPriceX96);
            //console.log("tick", tick);
             console.log("observationIndex", observationIndex);
             console.log("observationCardinality", observationCardinality);
             console.log("observationCardinalityNext", observationCardinalityNext);
             console.log("feeProtocol", feeProtocol);
             console.log("unlocked", unlocked);
             console.log("liquidity", liquidity);
        }
    }
}

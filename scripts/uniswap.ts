import { ethers } from "hardhat";
import { providers } from "ethers";

async function main() {

  const ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  //dai token address
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  //uni token address
  const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

  //WETH TOKEN ADDRESS
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  //dai holder
  const DAIHolder = "0x748dE14197922c4Ae258c7939C7739f3ff1db573";

  const path = [DAI,WETH];
  const pathDAIUNI = [DAI,UNI];
  let time = 2076592999;

    ///////////// INTERFACE COONECT  /////////////////
  const Uniswap = await ethers.getContractAt("IUniswap", ROUTER);

  ////////////// IMPERSONATION  ////////////////////////////
  const helpers = require("@nomicfoundation/hardhat-network-helpers");
  await helpers.impersonateAccount(DAIHolder);
  const impersonatedSigner = await ethers.getSigner(DAIHolder);

////////////////////// CONNECT DAI  /////////////////////
  const DaiContract = await ethers.getContractAt("IToken", DAI);

  ///////////////////  CONNECT UNI  /////////////////////////
  const UniContract = await ethers.getContractAt("IToken", UNI);

  ////////////////// GET BALANCE OF DAI HOLDER ///////////////
  const holderBalance = await DaiContract.balanceOf(DAIHolder);
  console.log(`Dai balance before ${holderBalance}`);

  ////////////////////  APPROVE FUNDS  //////////////////////
  const amountToSwap = await ethers.utils.parseEther("0.1");
  const amountToReceive = await ethers.utils.parseEther("0.5");
  const amountAmin = await ethers.utils.parseEther("0.01");
  const amountBmn = await ethers.utils.parseEther("0.01");
  const allowanceReceive= await DaiContract.connect(impersonatedSigner).approve(ROUTER, amountToReceive);
  const allowanceSwap= await DaiContract.connect(impersonatedSigner).approve(ROUTER, amountToSwap);
  const allowanceMin= await DaiContract.connect(impersonatedSigner).approve(ROUTER, amountAmin);
  const allowanceBMini= await DaiContract.connect(impersonatedSigner).approve(ROUTER, amountBmn);
  console.log(`Allowed balance : ${allowanceReceive}`);
  

  ///////////////////// CHECK BALANCES  ///////////////////////////
  const uniBalance = await UniContract.balanceOf(DAIHolder);
  console.log(`uniBalance ${uniBalance}`);

  const DAIBalance = await DaiContract.balanceOf(DAIHolder);
  console.log(`DAI balance: ${DAIBalance}`);
  
//////////////////// ADD LIQUIDITY  /////////////////////
    await Uniswap.connect(impersonatedSigner).addLiquidity(
    DAI,
    UNI,
    amountToSwap,
    amountToReceive,
    amountAmin,
    amountBmn,
    DAIHolder,
    time
  )
 const UNIBalanceAfter = await UniContract.balanceOf(DAIHolder);
  console.log(`UNI Balance after ${UNIBalanceAfter}`);

  const DAIholderBalanceAfter = await DaiContract.balanceOf(DAIHolder);
  console.log(`Dai balance After ETH: ${DAIholderBalanceAfter}`);


  /////////////////////////  ADD LIQUIDITY  ////////////////////
  const amountEthMin = await ethers.utils.parseEther("0.09");
  await Uniswap.connect(impersonatedSigner).addLiquidityETH(
    DAI,
    amountToReceive,
    amountAmin,
    amountEthMin,
    DAIHolder,
    time
  );

  const DAIBalanceAfter = await DaiContract.balanceOf(DAIHolder);
  console.log(`DAI balance: ${DAIBalanceAfter}`)


  //////////////// REMOVE LIQUIDITY  //////////////////////////

  await Uniswap.connect(impersonatedSigner).removeLiquidity(
    DAI,
    UNI,
    50,
    amountAmin,
    amountBmn,
    DAIHolder,
    time
  )

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
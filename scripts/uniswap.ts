import { ethers } from "hardhat";
import { impersonateAccount } from "@nomicfoundation/hardhat-network-helpers";

async function main() {

  const Uniswap_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const Uniswap_Router_Contract_Address = await ethers.getContractAt("IUniswap", Uniswap_ROUTER);

  //dai token address
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const DAI_Contract_Address = await ethers.getContractAt("IERC20", DAI);
  const DAIHolder = "0x748dE14197922c4Ae258c7939C7739f3ff1db573";


  //uni token address
  const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const UNI_Contract_Address = await ethers.getContractAt("IERC20", UNI);

  //USDC Address
  const USDC = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc";
  const USDC_Contract_Address = await ethers.getContractAt("IERC20", USDC);

  //WETH TOKEN ADDRESS
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const WETH_Contract_Address = await ethers.getContractAt("IERC20", WETH);
  //dai holder
  

  const path = [DAI,WETH];
  const pathDAIUNI = [DAI,UNI];
  let time = 2076592999;


  ////////////// IMPERSONATION  ////////////////////////////
  await impersonateAccount(DAIHolder);
  const impersonatedSigner = await ethers.getSigner(DAIHolder);

  ///////////////////  GET BALANCES  ////////////////////////
  console.log("`////////////// ADD LIQUIDITY //////////////`");
  
  const UNIBalanceBefore = await UNI_Contract_Address.balanceOf(DAIHolder);
  console.log(`UNI Balance: ${UNIBalanceBefore}`);

  const DAIBalanceBefore = await DAI_Contract_Address.balanceOf(DAIHolder);
  console.log(`DAI Balance: ${DAIBalanceBefore}`);

  /////////////////////// APPROVE UNI_ROUTER  ///////////////////
  await DAI_Contract_Address.connect(impersonatedSigner).approve(Uniswap_ROUTER, 50000);
  await UNI_Contract_Address.connect(impersonatedSigner).approve(Uniswap_ROUTER, 10000);
  
//////////////////// ADD LIQUIDITY  /////////////////////
    await Uniswap_Router_Contract_Address.connect(impersonatedSigner).addLiquidity(
    DAI,
    UNI,
    20000,
    5000,
    0,
    0,
    DAIHolder,
    time 
  )
//  const UNIBalanceAfter = await UniContract.balanceOf(DAIHolder);
//   console.log(`UNI Balance after ${UNIBalanceAfter}`);

const UNIBalanceAfter = await UNI_Contract_Address.balanceOf(DAIHolder);
console.log(`UNI Balance after: ${UNIBalanceAfter}`);

const DAIBalanceAfter = await DAI_Contract_Address.balanceOf(DAIHolder);
console.log(`DAI Balance after: ${DAIBalanceAfter}`);

  /////////////////////////  ADD LIQUIDITY ETH  ////////////////////

  console.log(`////////////////// ADD LIQUIDITY ETH  ///////////////`);
  const DAIBalanceBeforeAddETH = await DAI_Contract_Address.balanceOf(DAIHolder);
  console.log(`DAI Balance before: ${DAIBalanceBeforeAddETH}`);


  await DAI_Contract_Address.connect(impersonatedSigner).approve(Uniswap_ROUTER, 200_000);
  await Uniswap_Router_Contract_Address.connect(impersonatedSigner).addLiquidityETH(
    DAI,
    await ethers.utils.parseEther("10"),
    0,
    0,
    DAIHolder,
    time,
    {value: 10}
  );

  const DAIBalanceAfterAddEth = await DAI_Contract_Address.balanceOf(DAIHolder);
  console.log(`DAI balance: ${DAIBalanceAfterAddEth}`)


  //////////////// REMOVE LIQUIDITY  //////////////////////////

  console.log("/////////////////  REMOVE LIQUIDITY  ///////////////////////");
  const DAI_UNI_PAIR = "0x6F7e2CcaD0327f35DCeEf126f969ac193d2e7C3d";
  const DAI_UNI_Contract_Address_Router = await ethers.getContractAt("IUniswapV2Factory",DAI_UNI_PAIR);
  



//   await Uniswap.connect(impersonatedSigner).removeLiquidity(
//     DAI,
//     UNI,
//     50,
//     amountAmin,
//     amountBmin,
//     DAIHolder,
//     time
//   )

 }


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
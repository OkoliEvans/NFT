import { ethers } from "hardhat";

async function main() {
  
  const [owner] = await ethers.getSigners();
  const nft = await ethers.getContractFactory("NFT");
  const Nft = await nft.deploy();
  await Nft.deployed();


  console.log(`Deployed to: ${Nft.address}`);

  ////////////// SAFEMINT  ////////////////////
  const deployer = "0x58DcC051286728071423b907cF5eE1b8A40AC839";
  const token_id = 10010;
  const token_uri ="QmeTQWn11DpzdSsnJwEhNsSGKxqp6Qrh47ngsQG1JNn41p";

  const mint = await Nft.safeMint(deployer,token_id,token_uri);
  console.log("NFT minted successfully");
  
  

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

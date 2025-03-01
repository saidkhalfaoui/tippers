
const express = require('express');
const { ethers } = require('ethers');

// Assuming you have a valid Ethereum provider and USDC contract already initialized
// Example of an Ethereum provider
const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/9a7528cb7aff4b02ab41ff756902287b");

// USDC Contract Address and ABI
const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";  // Mainnet USDC Address
const USDC_ABI = [
  {
    "constant": true,
    "inputs": [
      { "name": "account", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

// Create contract instance
const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);

// Exported function to get USDC balance of a specific address
async function getUSDCBalance(address) {
	
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("Connected to Ethereum. Current Block Number:", blockNumber);
  } catch (error) {
    console.error("Error with provider connection:", error);
  }	
  try {
    console.log(`Getting USDC balance from ${address}`);

    // Get the balance from the contract (returns in wei, which is the smallest unit of token)
    const balance = await usdcContract.balanceOf(address);
    
    // Convert the balance from wei (6 decimals for USDC) to a human-readable format
    const formattedBalance = ethers.utils.formatUnits(balance, 6); // USDC has 6 decimals
    
    console.log(`Balance of ${address} is: ${formattedBalance} USDC`);
    return formattedBalance;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
}




exports.getUSDCBalance = async (req, res) => {
  const { address } = req.query;  // Get the address from query parameters

  if (!address) {
    return res.status(400).send("Ethereum address is required");
  }

  try {
	console.log(`Getting USDC balance`);  
    const balance = await getUSDCBalance(address);
    res.json({ address, balance });
  } catch (error) {
    res.status(500).send(`Error fetching balance: ${error.message || error}`);
  }
};

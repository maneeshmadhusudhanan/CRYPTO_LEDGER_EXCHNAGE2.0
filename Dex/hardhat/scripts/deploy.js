// scripts/deploy.js
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy CLXToken
    const CLXToken = await hre.ethers.getContractFactory("CLXToken");
    const clxToken = await CLXToken.deploy(
      "New Token Name",
      "NTN",
      hre.ethers.parseEther("1000000")
    );
    await clxToken.waitForDeployment();
    const clxTokenAddress = await clxToken.getAddress();
    console.log("CLXToken deployed to:", clxTokenAddress);

    // Deploy CryptoExchange
    const CryptoExchange = await hre.ethers.getContractFactory(
      "CryptoExchange"
    );
    const cryptoExchange = await CryptoExchange.deploy(clxTokenAddress);
    await cryptoExchange.waitForDeployment();
    const cryptoExchangeAddress = await cryptoExchange.getAddress();
    console.log("CryptoExchange deployed to:", cryptoExchangeAddress);

    // Create directories if they don't exist
    const uiDeploymentsDir = path.join(
      __dirname,
      "../../ui/src/scdata/deployed-address"
    );
    const uiAbiDir = path.join(__dirname, "../../ui/src/scdata/contract_abi");

    if (!fs.existsSync(uiDeploymentsDir)) {
      fs.mkdirSync(uiDeploymentsDir, { recursive: true });
    }
    if (!fs.existsSync(uiAbiDir)) {
      fs.mkdirSync(uiAbiDir, { recursive: true });
    }

    // Save individual contract addresses
    fs.writeFileSync(
      path.join(uiDeploymentsDir, "CLXToken.json"),
      JSON.stringify({ address: clxTokenAddress }, null, 2)
    );

    fs.writeFileSync(
      path.join(uiDeploymentsDir, "CryptoExchange.json"),
      JSON.stringify({ address: cryptoExchangeAddress }, null, 2)
    );

    // Save combined addresses for reference
    fs.writeFileSync(
      path.join(uiDeploymentsDir, "sepolia.json"),
      JSON.stringify(
        {
          CLXToken: clxTokenAddress,
          CryptoExchange: cryptoExchangeAddress,
        },
        null,
        2
      )
    );

    // Get contract artifacts
    const clxTokenArtifact = await hre.artifacts.readArtifact("CLXToken");
    const cryptoExchangeArtifact = await hre.artifacts.readArtifact(
      "CryptoExchange"
    );

    // Save ABIs
    fs.writeFileSync(
      path.join(uiAbiDir, "CLXToken.json"),
      JSON.stringify(clxTokenArtifact.abi, null, 2)
    );

    fs.writeFileSync(
      path.join(uiAbiDir, "CryptoExchange.json"),
      JSON.stringify(cryptoExchangeArtifact.abi, null, 2)
    );

    console.log("Deployment artifacts saved successfully!");
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

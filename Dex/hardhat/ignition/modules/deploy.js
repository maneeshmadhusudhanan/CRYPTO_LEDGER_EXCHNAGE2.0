const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployContracts", (m) => {
  // Deploy CLXToken with name
  const clxToken = m.contract("CLXToken", {
    args: ["CryptoLedger"],
  });

  // Deploy CryptoExchange
  const cryptoExchange = m.contract("CryptoExchange");

  return {
    clxToken,
    cryptoExchange,
  };
});

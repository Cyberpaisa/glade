const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying Glade contracts...");
  console.log("📍 Deployer:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "AVAX");

  // 1. Deploy SEED Token
  console.log("\n--- Deploying SeedToken ---");
  const SeedToken = await hre.ethers.getContractFactory("SeedToken");
  const seedToken = await SeedToken.deploy();
  await seedToken.waitForDeployment();
  const seedAddr = await seedToken.getAddress();
  console.log("✅ SeedToken deployed to:", seedAddr);

  // 2. Deploy Glade Game
  console.log("\n--- Deploying Glade ---");
  const Glade = await hre.ethers.getContractFactory("Glade");
  const glade = await Glade.deploy(seedAddr);
  await glade.waitForDeployment();
  const gameAddr = await glade.getAddress();
  console.log("✅ Glade deployed to:", gameAddr);

  // 3. Summary
  console.log("\n========================================");
  console.log("🌱 Glade — Deployment Complete");
  console.log("========================================");
  console.log("Network:     ", hre.network.name);
  console.log("SeedToken:   ", seedAddr);
  console.log("Glade:       ", gameAddr);
  console.log("========================================");
  console.log("\nNext steps:");
  console.log("1. Add contract addresses to frontend .env");
  console.log("2. Verify on SnowTrace: npx hardhat verify --network fuji", seedAddr);
  console.log("3. Claim SEED from faucet to start playing!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

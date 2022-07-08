// if the contract doesn't have a PriceFeed contract
const { network } = require("hardhat");
const { localChains, DECIMAL, INITIAL_ANSWER } = require("../hardhat-helper");

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();

	if (localChains.includes(network.name)) {
		log("Local network detected: Deploying mocks..."); // console.log
		await deploy("MockV3Aggregator", {
			contract: "MockV3Aggregator",
			from: deployer,
			log: true,
			args: [DECIMAL, INITIAL_ANSWER],
		});
		log("Mock deployed!");
		log("---------------------------------------------------");
	}
};

module.exports.tags = ["all", "mocks"]; // filter the mocks via --tags to deploy

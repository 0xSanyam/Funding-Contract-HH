const networks = {
	4: {
		name: "rinkeby",
		ethUsdPriceFeedAddress: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
	},
	137: {
		name: "polygon",
		ethUsdPriceFeedAddress: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
	},
};

const localChains = ["hardhat", "localhost"];
const DECIMAL = 9;
const INITIAL_ANSWER = 3000000000000;

// exporting this for others to work with it
module.exports = {
	networks,
	localChains,
	DECIMAL,
	INITIAL_ANSWER,
};

// This is a LIBRARY
// All the functions inside a library needs to be internal

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; // NPM Package

library PriceConverter {
	function getPrice(AggregatorV3Interface priceFeed)
		internal
		view
		returns (uint256)
	{
		(, int256 price, , , ) = priceFeed.latestRoundData();

		// msg.value and this should be equal in terms of formats
		return uint256(price * 1e10); // (1 X 10)^10 == 10000000000
	}

	function getConversionRate(
		uint256 ethAmount,
		AggregatorV3Interface priceFeed
	) internal view returns (uint256) {
		uint256 ethPrice = getPrice(priceFeed);
		uint256 ethPriceInUsd = (ethPrice * ethAmount) / 1e18;

		return ethPriceInUsd;
	}
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "./PriceConverter.sol";

// Custom Error
error FundMe__NotOwner();
error fund__SendMore();
error withdraw__failed();
error efficientWithdraw__failed();

// Interfaces, libraries, contracts

/** @title A contract for crowd funding
 *	@author Sanyam Mahajan
 * 	@notice This is contract is made for learning purpose
 * 	@dev Implements price feed as a library, all function calls are currently implemented without side effects
 *	@custom:experimental This is an experimental contract.
 */
contract FundMe {
	using PriceConverter for uint256;

	uint256 public constant MINIMUM_USD = 50 * 1e18;

	// Collecting the addresses of the funders
	address[] private s_funders;

	// Mapping the funders to the amount they sent
	mapping(address => uint256) private s_addressToAmountFunded;

	address private immutable i_owner;

	// 21,508 gas - immutable
	// 23,644 gas - non-immutable

	AggregatorV3Interface private s_priceFeed;
	modifier onlyOwner() {
		if (msg.sender != i_owner) {
			revert FundMe__NotOwner();
		}
		_; // rest of the original code is executed by writing this underscore
	}

	constructor(address priceFeedAddress) {
		i_owner = msg.sender; // whoever deploys the contract is the owner
		s_priceFeed = AggregatorV3Interface(priceFeedAddress);
	}

	// Special functions (constructor also) NO need to specify the "function" keyword.
	receive() external payable {
		fund();
	}

	fallback() external payable {
		fund();
	}

	/**
	 * 	@notice This function allows funding
	 * 	@dev All function calls are currently implemented without side effects
	 */
	function fund() public payable {
		if (!(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD))
			revert fund__SendMore();

		// Money math is done in terms of wei,
		// so, 1 ETH needs to be set as 1e18 value.

		s_funders.push(msg.sender);
		s_addressToAmountFunded[msg.sender] = msg.value;
	}

	function withdraw() public payable onlyOwner {
		for (
			uint256 funderIndex = 0;
			funderIndex < s_funders.length;
			funderIndex++
		) {
			address funder = s_funders[funderIndex];
			s_addressToAmountFunded[funder] = 0;
		}
		// reset the funders array
		s_funders = new address[](0);

		(bool callSuccess, ) = payable(msg.sender).call{
			value: address(this).balance
		}(""); // this returns two variables
		//(                ,bytes memory dataReturned)
		if (!callSuccess) revert withdraw__failed();
	}

	function efficientWithdraw() public payable onlyOwner {
		address[] memory funders = s_funders;

		for (
			uint256 funderIndex = 0;
			funderIndex < funders.length;
			funderIndex++
		) {
			address funder = funders[funderIndex];
			s_addressToAmountFunded[funder] = 0;
		}
		s_funders = new address[](0);
		(bool Success, ) = i_owner.call{value: address(this).balance}("");
		if (!Success) revert efficientWithdraw__failed();
	}

	function getOwner() public view returns (address) {
		return i_owner;
	}

	function getFunders(uint256 index) public view returns (address) {
		return s_funders[index];
	}

	function getAddressToAmountFunded(address funder)
		public
		view
		returns (uint256)
	{
		return s_addressToAmountFunded[funder];
	}

	function getPriceFeed() public view returns (AggregatorV3Interface) {
		return s_priceFeed;
	}
}

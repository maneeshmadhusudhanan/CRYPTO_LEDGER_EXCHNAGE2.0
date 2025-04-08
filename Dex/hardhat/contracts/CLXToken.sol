// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CLXToken is ERC20, Ownable {
    // Referral mapping
    mapping(address => address) public referrers;
    mapping(address => uint256) public referralCount;
    mapping(address => uint256) public referralRewards;
    
    // Bonus configuration
    uint256 public referralBonus = 100 * 10**18; // 100 CLX tokens for referral
    uint256 public dailyCheckinBonus = 10 * 10**18; // 10 CLX tokens for daily check-in
    mapping(address => uint256) public lastCheckin;
    
    constructor() ERC20("New Token Name", "NTN") Ownable() {
        // Mint initial supply of 1,000,000 tokens to the contract deployer
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // Function to set referral bonus amount
    function setReferralBonus(uint256 _amount) external onlyOwner {
        referralBonus = _amount;
    }

    // Function to set daily check-in bonus amount
    function setDailyCheckinBonus(uint256 _amount) external onlyOwner {
        dailyCheckinBonus = _amount;
    }

    // Function to register referral
    function registerReferral(address _referrer) external {
        require(_referrer != address(0), "Invalid referrer address");
        require(referrers[msg.sender] == address(0), "Already registered with a referrer");
        require(_referrer != msg.sender, "Cannot refer yourself");
        
        referrers[msg.sender] = _referrer;
        referralCount[_referrer]++;
    }

    // Function to claim referral rewards
    function claimReferralRewards() external {
        require(referralRewards[msg.sender] > 0, "No rewards to claim");
        uint256 rewards = referralRewards[msg.sender];
        referralRewards[msg.sender] = 0;
        _mint(msg.sender, rewards);
    }

    // Function for daily check-in
    function dailyCheckin() external {
        require(block.timestamp >= lastCheckin[msg.sender] + 1 days, "Already checked in today");
        lastCheckin[msg.sender] = block.timestamp;
        _mint(msg.sender, dailyCheckinBonus);
    }

    // Function to mint additional tokens (only by owner)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Function to burn tokens
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    // Function to get referral stats
    function getReferralStats(address _user) external view returns (
        uint256 count,
        uint256 rewards,
        address referrer
    ) {
        return (
            referralCount[_user],
            referralRewards[_user],
            referrers[_user]
        );
    }
}
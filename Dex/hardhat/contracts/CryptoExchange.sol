// SPDX-License-Identifier: MIT
// contracts/CryptoExchange.sol
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoExchange is Ownable {
    mapping(address => mapping(address => uint256)) public balances;
    mapping(address => uint256) public exchangeBonuses;
    uint256 public constant DEVELOPER_FEE_PERCENT = 2; // 2% developer fee
    
    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    event Transfer(
        address indexed sender,
        address indexed recipient,
        address indexed token,
        uint256 amount
    );
    event Trade(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );
    event BonusSet(address indexed token, uint256 bonus);

    constructor() Ownable() {}

    // Function to set exchange bonus for a token
    function setExchangeBonus(address _token, uint256 _bonus) external onlyOwner {
        exchangeBonuses[_token] = _bonus;
        emit BonusSet(_token, _bonus);
    }

    function deposit(address _token, uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(
            IERC20(_token).transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        balances[msg.sender][_token] += _amount;
        emit Deposit(msg.sender, _token, _amount);
    }

    function withdraw(address _token, uint256 _amount) external {
        require(balances[msg.sender][_token] >= _amount, "Insufficient balance");
        balances[msg.sender][_token] -= _amount;
        require(
            IERC20(_token).transfer(msg.sender, _amount),
            "Transfer failed"
        );
        emit Withdraw(msg.sender, _token, _amount);
    }

    function transfer(address _token, address _to, uint256 _amount) external {
        require(balances[msg.sender][_token] >= _amount, "Insufficient balance");
        balances[msg.sender][_token] -= _amount;
        balances[_to][_token] += _amount;
        emit Transfer(msg.sender, _to, _token, _amount);
    }

    function trade(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOut
    ) external {
        require(balances[msg.sender][_tokenIn] >= _amountIn, "Insufficient balance");
        require(_amountOut > 0, "Invalid output amount");
        
        // Calculate developer fee
        uint256 developerFee = (_amountOut * DEVELOPER_FEE_PERCENT) / 100;
        uint256 bonus = exchangeBonuses[_tokenOut];
        
        // Apply bonus if set
        if (bonus > 0) {
            _amountOut += bonus;
        }
        
        // Transfer developer fee to owner
        balances[owner()][_tokenOut] += developerFee;
        
        // Update user balances
        balances[msg.sender][_tokenIn] -= _amountIn;
        balances[msg.sender][_tokenOut] += (_amountOut - developerFee);
        
        emit Trade(msg.sender, _tokenIn, _tokenOut, _amountIn, _amountOut);
    }

    // Function to withdraw developer fees
    function withdrawDeveloperFees(address _token) external onlyOwner {
        uint256 amount = balances[owner()][_token];
        require(amount > 0, "No fees to withdraw");
        balances[owner()][_token] = 0;
        require(
            IERC20(_token).transfer(owner(), amount),
            "Transfer failed"
        );
    }
}
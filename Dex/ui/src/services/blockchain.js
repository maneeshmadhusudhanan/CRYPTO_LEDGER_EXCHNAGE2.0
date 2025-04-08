import { ethers } from "ethers";
import CLXToken from "../abis/CLXToken.json";
import CryptoExchange from "../abis/CryptoExchange.json";

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.tokenContract = null;
    this.exchangeContract = null;
    this.account = null;
  }

  async initialize() {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        this.account = await this.signer.getAddress();

        // Initialize contracts
        const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;
        const exchangeAddress = import.meta.env.VITE_EXCHANGE_ADDRESS;

        this.tokenContract = new ethers.Contract(
          tokenAddress,
          CLXToken.abi,
          this.signer
        );

        this.exchangeContract = new ethers.Contract(
          exchangeAddress,
          CryptoExchange.abi,
          this.signer
        );

        return this.account;
      } catch (error) {
        console.error("Error initializing blockchain:", error);
        throw error;
      }
    } else {
      throw new Error("Please install MetaMask!");
    }
  }

  async connect() {
    return this.initialize();
  }

  async disconnect() {
    this.provider = null;
    this.signer = null;
    this.tokenContract = null;
    this.exchangeContract = null;
    this.account = null;
  }

  async getBalance(address) {
    try {
      const balance = await this.exchangeContract.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  async getPrice() {
    try {
      const price = await this.exchangeContract.getPrice();
      return ethers.formatEther(price);
    } catch (error) {
      console.error("Error getting price:", error);
      throw error;
    }
  }

  async deposit(amount) {
    try {
      const amountWei = ethers.parseEther(amount.toString());
      const tx = await this.exchangeContract.deposit(amountWei);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error depositing:", error);
      throw error;
    }
  }

  async withdraw(amount) {
    try {
      const amountWei = ethers.parseEther(amount.toString());
      const tx = await this.exchangeContract.withdraw(amountWei);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error withdrawing:", error);
      throw error;
    }
  }

  async transfer(to, amount) {
    try {
      const amountWei = ethers.parseEther(amount.toString());
      const tx = await this.exchangeContract.transfer(to, amountWei);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error transferring:", error);
      throw error;
    }
  }

  async trade(amount) {
    try {
      const amountWei = ethers.parseEther(amount.toString());
      const tx = await this.exchangeContract.trade(amountWei);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error trading:", error);
      throw error;
    }
  }

  async getBalances() {
    try {
      const [clxBalance, exchangeBalance] = await Promise.all([
        this.tokenContract.balanceOf(this.account),
        this.exchangeContract.balances(this.account, CLX_TOKEN_ADDRESS),
      ]);

      return {
        clxBalance: ethers.formatUnits(clxBalance, 18),
        exchangeBalance: ethers.formatUnits(exchangeBalance, 18),
      };
    } catch (error) {
      console.error("Error getting balances:", error);
      throw error;
    }
  }

  async getTokenAllowance() {
    try {
      const allowance = await this.tokenContract.allowance(
        this.account,
        EXCHANGE_ADDRESS
      );
      return ethers.formatUnits(allowance, 18);
    } catch (error) {
      console.error("Error getting allowance:", error);
      throw error;
    }
  }

  async getBonusRate() {
    try {
      const rate = await this.exchangeContract.getBonusRate();
      return ethers.formatUnits(rate, 2); // Convert from basis points to percentage
    } catch (error) {
      console.error("Error getting bonus rate:", error);
      throw error;
    }
  }

  async setBonusRate(rate) {
    try {
      const rateBasisPoints = ethers.parseUnits(rate.toString(), 2); // Convert percentage to basis points
      const tx = await this.exchangeContract.setBonusRate(rateBasisPoints);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error setting bonus rate:", error);
      throw error;
    }
  }

  async getReferralCode(address) {
    try {
      const code = await this.exchangeContract.getReferralCode(address);
      return code;
    } catch (error) {
      console.error("Error getting referral code:", error);
      throw error;
    }
  }

  async useReferralCode(code) {
    try {
      const tx = await this.exchangeContract.useReferralCode(code);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error using referral code:", error);
      throw error;
    }
  }

  async getReferralRewards(address) {
    try {
      const rewards = await this.exchangeContract.getReferralRewards(address);
      return ethers.formatEther(rewards);
    } catch (error) {
      console.error("Error getting referral rewards:", error);
      throw error;
    }
  }

  async claimReferralRewards() {
    try {
      const tx = await this.exchangeContract.claimReferralRewards();
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error claiming referral rewards:", error);
      throw error;
    }
  }

  // Listen for account changes
  onAccountChange(callback) {
    window.ethereum.on("accountsChanged", (accounts) => {
      this.account = accounts[0];
      callback(accounts[0]);
    });
  }

  // Listen for network changes
  onNetworkChange(callback) {
    window.ethereum.on("chainChanged", (chainId) => {
      callback(chainId);
    });
  }
}

export const blockchainService = new BlockchainService();

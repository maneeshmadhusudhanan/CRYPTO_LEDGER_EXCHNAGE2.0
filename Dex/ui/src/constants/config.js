// Contract addresses
export const CLX_TOKEN_ADDRESS = "0x755F27686fAF89A28A4A644D8A9CABDFA7C67c5A";
export const EXCHANGE_ADDRESS = "0x480954F5f32F158146D2B626De20c39237BA8346";

// Network configurations
export const SUPPORTED_NETWORKS = {
  localhost: {
    chainId: "0x7A69",
    chainName: "Localhost 8545",
    rpcUrls: ["http://127.0.0.1:8545/"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["http://localhost:3000"],
  },
  sepolia: {
    chainId: "0xaa36a7",
    chainName: "Sepolia",
    rpcUrls: ["https://sepolia.infura.io/v3/"],
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "SEP",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
};

export const DEFAULT_NETWORK_ID = "0xaa36a7"; // Sepolia

// UI constants
export const NOTIFICATION_DURATION = 5000;
export const MAX_DECIMALS = 18;
export const MAX_AMOUNT = "1000000";
export const MIN_AMOUNT = "0.000001";

// API endpoints
export const API_ENDPOINTS = {
  PRICE_FEED: "/api",
  SUPPORT: "https://api.example.com/support",
};

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_SUPPORTED: "Please install MetaMask or another Web3 wallet",
  WALLET_NOT_CONNECTED: "Please connect your wallet to continue",
  WALLET_CONNECTION_FAILED: "Failed to connect wallet",
  INSUFFICIENT_BALANCE: "Insufficient balance",
  TRANSACTION_FAILED: "Transaction failed",
  API_ERROR: "Failed to fetch data from API",
  PRICE_FETCH_ERROR: "Failed to fetch price data",
  DEPOSIT_ERROR: "Failed to deposit tokens",
  WITHDRAW_ERROR: "Failed to withdraw tokens",
  TRANSFER_ERROR: "Failed to transfer tokens",
  TRADE_ERROR: "Failed to execute trade",
  UNKNOWN_ERROR: "An unknown error occurred",
  NETWORK_ERROR: "Network error occurred",
  INVALID_AMOUNT: "Please enter a valid amount",
  APPROVAL_REQUIRED: "Token approval required",
  INVALID_ADDRESS: "Please enter a valid recipient address",
  REFERRAL_ERROR: "Failed to process referral code",
  CLAIM_ERROR: "Failed to claim rewards",
  PORTFOLIO_LOAD_ERROR: "Failed to load portfolio data",
};

// Success messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: "Wallet connected successfully",
  WALLET_DISCONNECTED: "Wallet disconnected",
  TRANSACTION_SUCCESS: "Transaction completed successfully",
  DEPOSIT_SUCCESS: "Deposit successful",
  WITHDRAW_SUCCESS: "Withdrawal successful",
  TRANSFER_SUCCESS: "Tokens transferred successfully",
  TRADE_SUCCESS: "Trade executed successfully",
  APPROVAL_SUCCESS: "Token approved successfully",
  REFERRAL_SUCCESS: "Referral code applied successfully",
  CLAIM_SUCCESS: "Rewards claimed successfully",
};

// Transaction configurations
export const TX_CONFIG = {
  GAS_LIMIT: {
    DEPOSIT: "200000",
    WITHDRAW: "150000",
    TRANSFER: "100000",
    TRADE: "250000",
    APPROVE: "100000",
  },
  GAS_PRICE_MULTIPLIER: 1.2,
  MAX_PRIORITY_FEE: "2000000000", // 2 Gwei
  MAX_FEE: "50000000000", // 50 Gwei
  TIMEOUT: 300000, // 5 minutes
};

// Network configurations
export const NETWORK_CONFIG = {
  SEPOLIA: {
    CHAIN_ID: "0xaa36a7",
    NAME: "Sepolia",
    RPC_URL: "https://sepolia.infura.io/v3/",
    EXPLORER_URL: "https://sepolia.etherscan.io",
    GAS_STATION_URL: "https://ethgasstation.info/api/ethgasAPI.json",
    CURRENCY: {
      NAME: "Sepolia Ether",
      SYMBOL: "SEP",
      DECIMALS: 18,
    },
  },
};

// Contract configurations
export const CONTRACT_CONFIG = {
  TOKEN: {
    DECIMALS: 18,
    SYMBOL: "CLX",
    NAME: "Cryptoledger Token",
    ABI_PATH: "/src/scdata/contract_abi/CLXToken.json",
    ADDRESS_PATH: "/src/scdata/deployed-address/CLXToken.json",
  },
  EXCHANGE: {
    NAME: "Cryptoledger Exchange",
    VERSION: "1.0.0",
    ABI_PATH: "/src/scdata/contract_abi/CryptoExchange.json",
    ADDRESS_PATH: "/src/scdata/deployed-address/CryptoExchange.json",
  },
};

const COINGECKO_API_KEY = "YOUR-API-KEY"; // Get from https://www.coingecko.com/api/pricing

const BASE_URL = "/api";
const CACHE_DURATION = 60000; // 1 minute cache
const RATE_LIMIT_DELAY = 1000; // 1 second between requests

const cache = new Map();
let lastRequestTime = 0;

const headers = {
  "Content-Type": "application/json",
  "x-cg-pro-api-key": COINGECKO_API_KEY,
  Accept: "application/json",
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

export const proxyRequest = async (endpoint, params = {}) => {
  try {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await delay(RATE_LIMIT_DELAY - timeSinceLastRequest);
    }

    lastRequestTime = Date.now();

    const queryString = new URLSearchParams(params).toString();
    const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ""}`;
    const cacheKey = `${endpoint}-${queryString}`;

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      mode: "cors",
      credentials: "omit",
      cache: "no-cache",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Proxy request error:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

export const getTokenPrice = async (
  tokenId = "ethereum",
  vsCurrency = "usd"
) => {
  return proxyRequest("/simple/price", {
    ids: tokenId,
    vs_currencies: vsCurrency,
  });
};

export const getTokenPriceHistory = async (
  tokenId = "ethereum",
  vsCurrency = "usd",
  days = 7
) => {
  return proxyRequest("/coins/market_chart", {
    id: tokenId,
    vs_currency: vsCurrency,
    days: days,
  });
};

export const getTokenInfo = async (tokenId = "ethereum") => {
  return proxyRequest(`/coins/${tokenId}`, {
    localization: false,
    tickers: false,
    community_data: false,
    developer_data: false,
  });
};

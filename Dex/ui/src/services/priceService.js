const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const proxyRequest = async (url, options = {}) => {
  try {
    // Use the proxy endpoint
    const proxyUrl = `/api${url}`;
    const response = await fetch(proxyUrl, {
      ...options,
      headers: {
        ...options.headers,
        "x-cg-pro-api-key": COINGECKO_API_KEY,
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Proxy request error:", error);
    throw error;
  }
};

const withRetry = async (fn, retries = MAX_RETRIES) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.message.includes("Rate limit")) {
      await delay(RETRY_DELAY);
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
};

const getFallbackPriceData = () => {
  const now = Date.now();
  const prices = [];
  const basePrice = 2000;
  const volatility = 100;

  for (let i = 0; i < 7; i++) {
    const timestamp = now - i * 24 * 60 * 60 * 1000;
    const randomChange = (Math.random() - 0.5) * volatility;
    prices.push([timestamp, basePrice + randomChange]);
  }

  return prices.reverse();
};

const getFallbackTokenInfo = () => {
  const basePrice = 2000;
  const randomChange = (Math.random() - 0.5) * 10;

  return {
    name: "Ethereum",
    symbol: "ETH",
    current_price: basePrice + randomChange,
    price_change_percentage_24h: randomChange,
    market_cap: 250000000000,
    total_volume: 15000000000,
  };
};

export const fetchTokenPrice = async (tokenId = "ethereum") => {
  try {
    const data = await withRetry(async () => {
      return await proxyRequest(
        `/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true`
      );
    });
    return data[tokenId]?.usd || 0;
  } catch (error) {
    console.warn("Using fallback price data");
    return getFallbackTokenInfo().current_price;
  }
};

export const fetchTokenPriceHistory = async (
  tokenId = "ethereum",
  days = "7d"
) => {
  try {
    // Convert timeframe to days
    const daysMap = {
      "24h": 1,
      "7d": 7,
      "30d": 30,
    };
    const numDays = daysMap[days] || 7;

    const data = await withRetry(async () => {
      return await proxyRequest(
        `/coins/${tokenId}/market_chart?vs_currency=usd&days=${numDays}&interval=daily`
      );
    });

    // Transform the data to match the chart format
    if (data && data.prices) {
      return data.prices.map(([timestamp, price]) => ({
        time: new Date(timestamp).toLocaleDateString(),
        price: price,
      }));
    }
    return [];
  } catch (error) {
    console.warn("Using fallback price history data");
    return getFallbackPriceData().map(([timestamp, price]) => ({
      time: new Date(timestamp).toLocaleDateString(),
      price: price,
    }));
  }
};

export const fetchTokenInfo = async (tokenId = "ethereum") => {
  try {
    const data = await withRetry(async () => {
      return await proxyRequest(
        `/coins/${tokenId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false&vs_currency=usd`
      );
    });
    return {
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      current_price: data.market_data?.current_price?.usd || 0,
      price_change_percentage_24h:
        data.market_data?.price_change_percentage_24h || 0,
      market_cap: data.market_data?.market_cap?.usd || 0,
      total_volume: data.market_data?.total_volume?.usd || 0,
    };
  } catch (error) {
    console.warn("Using fallback token info");
    return getFallbackTokenInfo();
  }
};

export const fetchTokenList = async (page = 1, perPage = 20) => {
  try {
    const data = await withRetry(async () => {
      return await proxyRequest(
        `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d&locale=en`
      );
    });

    return data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      total_volume: coin.total_volume,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_1h: coin.price_change_percentage_1h_in_currency,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      price_change_percentage_7d: coin.price_change_percentage_7d_in_currency,
      sparkline_in_7d: coin.sparkline_in_7d,
      last_updated: coin.last_updated,
    }));
  } catch (error) {
    console.warn("Using fallback token list data");
    return [
      {
        id: "bitcoin",
        symbol: "BTC",
        name: "Bitcoin",
        image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
        current_price: 50000,
        market_cap: 1000000000000,
        market_cap_rank: 1,
        total_volume: 30000000000,
        high_24h: 51000,
        low_24h: 49000,
        price_change_24h: 1000,
        price_change_percentage_1h: 0.5,
        price_change_percentage_24h: 2,
        price_change_percentage_7d: 5,
        sparkline_in_7d: { price: Array(168).fill(50000) },
        last_updated: new Date().toISOString(),
      },
      // Add more fallback tokens if needed
    ];
  }
};

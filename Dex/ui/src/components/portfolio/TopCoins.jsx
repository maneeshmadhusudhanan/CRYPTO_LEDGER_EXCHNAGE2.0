import React, { useState, useEffect } from "react";
import Loading from "../common/Loading";
import { formatPrice } from "../../utils/helpers";

function TopCoins() {
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    const fetchCoins = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setCoins(data);
      } catch (err) {
        console.error("Error fetching coins:", err);
        setError("Failed to load coin data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoins();
  }, [page]);

  const formatLargeNumber = (num) => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    }
    return `$${num.toFixed(2)}`;
  };

  if (isLoading) {
    return <Loading text="Loading top coins..." />;
  }

  if (error) {
    return (
      <div className="bg-red-900/50 text-red-200 p-4 rounded-lg">{error}</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* API Documentation Section */}


      {/* Top Coins Table */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            Top Coins by Market Cap
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-700 text-gray-400 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-400 px-3 py-1">Page {page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={coins.length < perPage}
              className="px-3 py-1 rounded bg-gray-700 text-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="p-4">#</th>
                <th className="p-4">Coin</th>
                <th className="p-4">Price</th>
                <th className="p-4">1h</th>
                <th className="p-4">24h</th>
                <th className="p-4">7d</th>
                <th className="p-4">24h Volume</th>
                <th className="p-4">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, index) => (
                <tr
                  key={coin.id}
                  className="border-b border-gray-700 hover:bg-gray-700/50"
                >
                  <td className="p-4 text-gray-400">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-6 h-6 mr-2"
                      />
                      <div>
                        <div className="text-white font-medium">
                          {coin.name}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {coin.symbol.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white">
                    ${formatPrice(coin.current_price)}
                  </td>
                  <td
                    className={`p-4 ${
                      coin.price_change_percentage_1h_in_currency >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {coin.price_change_percentage_1h_in_currency?.toFixed(1)}%
                  </td>
                  <td
                    className={`p-4 ${
                      coin.price_change_percentage_24h >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {coin.price_change_percentage_24h?.toFixed(1)}%
                  </td>
                  <td
                    className={`p-4 ${
                      coin.price_change_percentage_7d_in_currency >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {coin.price_change_percentage_7d_in_currency?.toFixed(1)}%
                  </td>
                  <td className="p-4 text-white">
                    {formatLargeNumber(coin.total_volume)}
                  </td>
                  <td className="p-4 text-white">
                    {formatLargeNumber(coin.market_cap)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TopCoins;

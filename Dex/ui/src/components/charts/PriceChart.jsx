import React, { useEffect, useState, useCallback } from "react";
import * as Recharts from "recharts";
import { fetchTokenPriceHistory } from "../../services/priceService";
import { ERROR_MESSAGES } from "../../constants/config";
import { ethers } from "ethers";
import { useNetwork } from "../../contexts/NetworkContext";

const PriceChart = ({ tokenId = "ethereum", days = 7 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const { updateNetworkInfo, loadData, switchToSepolia } = useNetwork();

  const initProvider = useCallback(async () => {
    try {
      if (!window.ethereum) {
        setIsInitialized(true);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      // Get and set network info
      await updateNetworkInfo(provider);

      // Check if we're on the correct network
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId);
      if (currentChainId !== Number(NETWORK_CONFIG.SEPOLIA.CHAIN_ID)) {
        await switchToSepolia();
      }

      // Check if we're already connected
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const signer = await provider.getSigner();
        setSigner(signer);
        await loadData();
      }

      setIsInitialized(true);
    } catch (err) {
      setIsInitialized(true);
      console.log("Wallet not available:", err.message);
    }
  }, [updateNetworkInfo, loadData, switchToSepolia]);

  useEffect(() => {
    const loadPriceHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const priceData = await fetchTokenPriceHistory(tokenId, days);
        setData(priceData);
      } catch (err) {
        setError(err.message || ERROR_MESSAGES.FETCH_ERROR);
        console.error("Error loading price history:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPriceHistory();
  }, [tokenId, days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-center">
          <p className="font-semibold">Error loading chart</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 text-center">
          <p className="font-semibold">No data available</p>
          <p className="text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <Recharts.ResponsiveContainer width="100%" height="100%">
        <Recharts.LineChart data={data}>
          <Recharts.CartesianGrid strokeDasharray="3 3" />
          <Recharts.XAxis
            dataKey="time"
            tickFormatter={(timestamp) =>
              new Date(timestamp).toLocaleDateString()
            }
          />
          <Recharts.YAxis
            domain={["auto", "auto"]}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Recharts.Tooltip
            labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
            formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
          />
          <Recharts.Line
            type="monotone"
            dataKey="price"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />
        </Recharts.LineChart>
      </Recharts.ResponsiveContainer>
    </div>
  );
};

export default PriceChart;

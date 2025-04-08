import { useQuery } from "@tanstack/react-query";
import {
  fetchTokenPrice,
  fetchTokenPriceHistory,
  fetchTokenInfo,
  fetchTokenList,
} from "../services/priceService";

export const useTokenPrice = (tokenId = "ethereum") => {
  return useQuery({
    queryKey: ["tokenPrice", tokenId],
    queryFn: () => fetchTokenPrice(tokenId),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

export const useTokenPriceHistory = (
  tokenId = "ethereum",
  timeframe = "7d"
) => {
  return useQuery({
    queryKey: ["tokenPriceHistory", tokenId, timeframe],
    queryFn: () => fetchTokenPriceHistory(tokenId, timeframe),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

export const useTokenInfo = (tokenId = "ethereum") => {
  return useQuery({
    queryKey: ["tokenInfo", tokenId],
    queryFn: () => fetchTokenInfo(tokenId),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

export const useTokenList = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ["tokenList", page, perPage],
    queryFn: () => fetchTokenList(page, perPage),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

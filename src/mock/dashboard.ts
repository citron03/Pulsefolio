export type Holding = {
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
};

export type MarketIndex = {
  label: string;
  value: number;
  changeRate: number;
};

export const mockHoldings: Holding[] = [
  {
    symbol: "005930",
    name: "삼성전자",
    quantity: 12,
    avgBuyPrice: 74800,
    currentPrice: 78200,
  },
  {
    symbol: "000660",
    name: "SK하이닉스",
    quantity: 4,
    avgBuyPrice: 178000,
    currentPrice: 186500,
  },
  {
    symbol: "035420",
    name: "NAVER",
    quantity: 6,
    avgBuyPrice: 201000,
    currentPrice: 196200,
  },
  {
    symbol: "305720",
    name: "KODEX 2차전지산업",
    quantity: 20,
    avgBuyPrice: 23400,
    currentPrice: 24500,
  },
];

export const mockIndexes: MarketIndex[] = [
  { label: "KOSPI", value: 2764.18, changeRate: 0.84 },
  { label: "KOSDAQ", value: 853.61, changeRate: -0.46 },
  { label: "NASDAQ", value: 18394.33, changeRate: 1.12 },
  { label: "S&P500", value: 5331.94, changeRate: 0.53 },
  { label: "USD/KRW", value: 1379.4, changeRate: -0.22 },
];

export const mockWatchlist = [
  { symbol: "207940", name: "삼성바이오로직스", price: 845000, changeRate: 2.8 },
  { symbol: "373220", name: "LG에너지솔루션", price: 336000, changeRate: -1.4 },
  { symbol: "035720", name: "카카오", price: 50500, changeRate: 3.2 },
];

import {
  createKisConfig,
  fetchKisAccessToken,
  fetchKisQuotes,
  hasKisCredentials,
  KisApiError,
  type KisToken,
  type PulsefolioQuote,
} from "@/lib/kis";
import { mockHoldings, mockWatchlist } from "@/mock/dashboard";

export const dynamic = "force-dynamic";

let cachedToken: KisToken | null = null;

export async function GET(request: Request) {
  const symbols = parseSymbols(new URL(request.url).searchParams.get("symbols"));

  if (symbols.length === 0) {
    return Response.json(
      {
        status: "error",
        message: "symbols query parameter is required",
        data: [],
      },
      { status: 400 },
    );
  }

  if (shouldUseMock()) {
    return Response.json({
      status: "ready",
      source: "mock",
      data: getMockQuotes(symbols),
    });
  }

  try {
    const config = createKisConfig(process.env);
    const token = await getAccessToken(config);
    const quotes = await fetchKisQuotes(config, token.accessToken, symbols);

    return Response.json({
      status: "ready",
      source: "kis",
      data: quotes,
    });
  } catch (error) {
    const fallback = getMockQuotes(symbols).map((quote) => ({
      ...quote,
      stale: true,
    }));

    return Response.json(
      {
        status: fallback.length > 0 ? "stale" : "error",
        source: "kis",
        message: toPublicErrorMessage(error),
        data: fallback,
      },
      { status: fallback.length > 0 ? 200 : 502 },
    );
  }
}

function parseSymbols(value: string | null): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((symbol) => symbol.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function shouldUseMock(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK === "true" || !hasKisCredentials(process.env);
}

function getMockQuotes(symbols: string[]): PulsefolioQuote[] {
  const quotePool = [
    ...mockHoldings.map((holding) => ({
      symbol: holding.symbol,
      price: holding.currentPrice,
      change: holding.currentPrice - holding.avgBuyPrice,
      changeRate: ((holding.currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100,
      volume: 0,
    })),
    ...mockWatchlist.map((item) => ({
      symbol: item.symbol,
      price: item.price,
      change: 0,
      changeRate: item.changeRate,
      volume: 0,
    })),
  ];

  return symbols.map((symbol) => {
    const quote = quotePool.find((item) => item.symbol === symbol);

    return {
      symbol,
      price: quote?.price ?? 0,
      change: quote?.change ?? 0,
      changeRate: quote?.changeRate ?? 0,
      volume: quote?.volume ?? 0,
      updatedAt: new Date().toISOString(),
      stale: false,
      source: "mock",
    };
  });
}

async function getAccessToken(
  config: Parameters<typeof fetchKisAccessToken>[0],
): Promise<KisToken> {
  if (cachedToken && cachedToken.expiresAt.getTime() > Date.now()) {
    return cachedToken;
  }

  cachedToken = await fetchKisAccessToken(config);
  return cachedToken;
}

function toPublicErrorMessage(error: unknown): string {
  if (error instanceof KisApiError) {
    return error.code ? `KIS API error (${error.code})` : error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "KIS API request failed";
}

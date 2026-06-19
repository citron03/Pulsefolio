import {
  createKisConfig,
  fetchKisAccessToken,
  fetchKisDailyCandles,
  hasKisCredentials,
  KisApiError,
  type KisToken,
  type PulsefolioCandle,
} from "@/lib/kis";
import { mockSparkline } from "@/mock/charts";

export const dynamic = "force-dynamic";

type ChartRange = "1w" | "1m" | "3m" | "1y";

let cachedToken: KisToken | null = null;

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const symbol = searchParams.get("symbol")?.trim();
  const range = parseRange(searchParams.get("range"));

  if (!symbol) {
    return Response.json(
      {
        status: "error",
        message: "symbol query parameter is required",
        data: [],
      },
      { status: 400 },
    );
  }

  if (shouldUseMock()) {
    return Response.json({
      status: "ready",
      source: "mock",
      symbol,
      range,
      data: getMockCandles(symbol),
    });
  }

  try {
    const config = createKisConfig(process.env);
    const token = await getAccessToken(config);
    const { startDate, endDate } = getDateWindow(range);
    const candles = await fetchKisDailyCandles(config, token.accessToken, {
      symbol,
      startDate,
      endDate,
    });

    return Response.json({
      status: "ready",
      source: "kis",
      symbol,
      range,
      data: candles,
    });
  } catch (error) {
    const fallback = getMockCandles(symbol);

    return Response.json(
      {
        status: fallback.length > 0 ? "stale" : "error",
        source: "kis",
        symbol,
        range,
        message: toPublicErrorMessage(error),
        data: fallback,
      },
      { status: fallback.length > 0 ? 200 : 502 },
    );
  }
}

function parseRange(value: string | null): ChartRange {
  if (value === "1w" || value === "3m" || value === "1y") {
    return value;
  }

  return "1m";
}

function shouldUseMock(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK === "true" || !hasKisCredentials(process.env);
}

function getMockCandles(symbol: string): PulsefolioCandle[] {
  const values = mockSparkline[symbol as keyof typeof mockSparkline] ?? [];
  const today = new Date("2026-06-19T00:00:00.000Z");

  return values.map((close, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (values.length - index - 1));
    const open = values[index - 1] ?? close;

    return {
      date: date.toISOString().slice(0, 10),
      open,
      high: Math.max(open, close),
      low: Math.min(open, close),
      close,
      volume: 0,
    };
  });
}

function getDateWindow(range: ChartRange): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date(end);
  const daysByRange: Record<ChartRange, number> = {
    "1w": 7,
    "1m": 31,
    "3m": 93,
    "1y": 366,
  };
  start.setDate(end.getDate() - daysByRange[range]);

  return {
    startDate: toKisDate(start),
    endDate: toKisDate(end),
  };
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

function toKisDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
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

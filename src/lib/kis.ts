export type KisEnv = "real" | "virtual";

export type KisConfig = {
  env: KisEnv;
  baseUrl: string;
  appKey: string;
  appSecret: string;
  accountNo?: string;
  accountProductCode?: string;
  htsId?: string;
};

export type KisToken = {
  accessToken: string;
  expiresAt: Date;
};

export type PulsefolioQuote = {
  symbol: string;
  price: number;
  change: number;
  changeRate: number;
  volume: number;
  updatedAt: string;
  stale: boolean;
  source: "kis" | "mock";
};

export type PulsefolioCandle = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type Fetcher = typeof fetch;

type EnvSource = Partial<Record<string, string | undefined>>;

type KisPriceOutput = {
  stck_prpr?: string;
  prdy_vrss?: string;
  prdy_ctrt?: string;
  acml_vol?: string;
};

type KisDailyCandleOutput = {
  stck_bsop_date?: string;
  stck_oprc?: string;
  stck_hgpr?: string;
  stck_lwpr?: string;
  stck_clpr?: string;
  acml_vol?: string;
};

type KisResponse<T> = {
  rt_cd?: string;
  msg_cd?: string;
  msg1?: string;
  output?: T;
  output2?: T[];
};

const KIS_BASE_URLS: Record<KisEnv, string> = {
  real: "https://openapi.koreainvestment.com:9443",
  virtual: "https://openapivts.koreainvestment.com:29443",
};

const CURRENT_PRICE_TR_ID = "FHKST01010100";
const DAILY_CHART_TR_ID = "FHKST03010100";

export class KisApiError extends Error {
  readonly code?: string;
  readonly status?: number;

  constructor(message: string, options: { code?: string; status?: number } = {}) {
    super(message);
    this.name = "KisApiError";
    this.code = options.code;
    this.status = options.status;
  }
}

export function createKisConfig(env: EnvSource): KisConfig {
  const kisEnv = env.KIS_ENV === "real" ? "real" : "virtual";
  const appKey = env.KIS_APP_KEY;
  const appSecret = env.KIS_APP_SECRET;

  if (!appKey) {
    throw new Error("KIS_APP_KEY is required");
  }

  if (!appSecret) {
    throw new Error("KIS_APP_SECRET is required");
  }

  return {
    env: kisEnv,
    baseUrl: KIS_BASE_URLS[kisEnv],
    appKey,
    appSecret,
    accountNo: env.KIS_ACCOUNT_NO,
    accountProductCode: env.KIS_ACCOUNT_PRODUCT_CODE ?? "01",
    htsId: env.KIS_HTS_ID,
  };
}

export function hasKisCredentials(env: EnvSource): boolean {
  return Boolean(env.KIS_APP_KEY && env.KIS_APP_SECRET);
}

export async function fetchKisAccessToken(config: KisConfig, fetcher: Fetcher = fetch) {
  const response = await fetcher(`${config.baseUrl}/oauth2/tokenP`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      appkey: config.appKey,
      appsecret: config.appSecret,
    }),
  });

  if (!response.ok) {
    throw new KisApiError("KIS token request failed", { status: response.status });
  }

  const body = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    access_token_token_expired?: string;
  };

  if (!body.access_token) {
    throw new KisApiError("KIS token response did not include access_token");
  }

  const expiresInMs = Math.max((body.expires_in ?? 86400) - 60, 0) * 1000;

  return {
    accessToken: body.access_token,
    expiresAt: new Date(Date.now() + expiresInMs),
  } satisfies KisToken;
}

export function normalizeKisPrice(symbol: string, output: KisPriceOutput): PulsefolioQuote {
  return {
    symbol,
    price: toNumber(output.stck_prpr),
    change: toNumber(output.prdy_vrss),
    changeRate: toNumber(output.prdy_ctrt),
    volume: toNumber(output.acml_vol),
    updatedAt: new Date().toISOString(),
    stale: false,
    source: "kis",
  };
}

export function normalizeKisDailyCandle(output: KisDailyCandleOutput): PulsefolioCandle {
  return {
    date: toIsoDate(output.stck_bsop_date),
    open: toNumber(output.stck_oprc),
    high: toNumber(output.stck_hgpr),
    low: toNumber(output.stck_lwpr),
    close: toNumber(output.stck_clpr),
    volume: toNumber(output.acml_vol),
  };
}

export async function fetchKisQuotes(
  config: KisConfig,
  accessToken: string,
  symbols: string[],
  fetcher: Fetcher = fetch,
) {
  const quotes = await Promise.all(
    symbols.map(async (symbol) => {
      const params = new URLSearchParams({
        FID_COND_MRKT_DIV_CODE: "J",
        FID_INPUT_ISCD: symbol,
      });
      const response = await fetcher(
        `${config.baseUrl}/uapi/domestic-stock/v1/quotations/inquire-price?${params}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${accessToken}`,
            appkey: config.appKey,
            appsecret: config.appSecret,
            tr_id: CURRENT_PRICE_TR_ID,
            custtype: "P",
          },
        },
      );

      if (!response.ok) {
        throw new KisApiError("KIS quote request failed", { status: response.status });
      }

      const body = (await response.json()) as KisResponse<KisPriceOutput>;

      if (body.rt_cd && body.rt_cd !== "0") {
        throw new KisApiError(body.msg1 ?? "KIS quote business error", { code: body.msg_cd });
      }

      if (!body.output) {
        throw new KisApiError("KIS quote response did not include output");
      }

      return normalizeKisPrice(symbol, body.output);
    }),
  );

  return quotes;
}

export async function fetchKisDailyCandles(
  config: KisConfig,
  accessToken: string,
  options: { symbol: string; startDate: string; endDate: string },
  fetcher: Fetcher = fetch,
) {
  const params = new URLSearchParams({
    FID_COND_MRKT_DIV_CODE: "J",
    FID_INPUT_ISCD: options.symbol,
    FID_INPUT_DATE_1: options.startDate,
    FID_INPUT_DATE_2: options.endDate,
    FID_PERIOD_DIV_CODE: "D",
    FID_ORG_ADJ_PRC: "1",
  });
  const response = await fetcher(
    `${config.baseUrl}/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice?${params}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${accessToken}`,
        appkey: config.appKey,
        appsecret: config.appSecret,
        tr_id: DAILY_CHART_TR_ID,
        custtype: "P",
      },
    },
  );

  if (!response.ok) {
    throw new KisApiError("KIS daily chart request failed", { status: response.status });
  }

  const body = (await response.json()) as KisResponse<KisDailyCandleOutput>;

  if (body.rt_cd && body.rt_cd !== "0") {
    throw new KisApiError(body.msg1 ?? "KIS daily chart business error", { code: body.msg_cd });
  }

  return (body.output2 ?? []).map(normalizeKisDailyCandle);
}

function toNumber(value: string | undefined): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function toIsoDate(value: string | undefined): string {
  if (!value || value.length !== 8) {
    return "";
  }

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

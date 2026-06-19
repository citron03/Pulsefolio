import { describe, expect, it, vi } from "vitest";
import {
  createKisConfig,
  fetchKisAccessToken,
  fetchKisDailyCandles,
  fetchKisQuotes,
  KisApiError,
  normalizeKisDailyCandle,
  normalizeKisPrice,
} from "@/lib/kis";

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    status: 200,
    ...init,
  });
}

describe("createKisConfig", () => {
  it("builds a virtual investment config from server-only env values", () => {
    const config = createKisConfig({
      KIS_ENV: "virtual",
      KIS_APP_KEY: "app-key",
      KIS_APP_SECRET: "app-secret",
      KIS_ACCOUNT_NO: "12345678",
      KIS_ACCOUNT_PRODUCT_CODE: "01",
    });

    expect(config.baseUrl).toBe("https://openapivts.koreainvestment.com:29443");
    expect(config.accountNo).toBe("12345678");
    expect(config.accountProductCode).toBe("01");
  });

  it("rejects missing app credentials", () => {
    expect(() => createKisConfig({ KIS_ENV: "virtual" })).toThrow("KIS_APP_KEY");
  });
});

describe("fetchKisAccessToken", () => {
  it("requests an access token with app credentials", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      jsonResponse({
        access_token: "token-123",
        expires_in: 86400,
      }),
    );

    const token = await fetchKisAccessToken(
      {
        env: "virtual",
        baseUrl: "https://openapivts.koreainvestment.com:29443",
        appKey: "app-key",
        appSecret: "app-secret",
      },
      fetcher,
    );

    expect(fetcher).toHaveBeenCalledWith(
      "https://openapivts.koreainvestment.com:29443/oauth2/tokenP",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          grant_type: "client_credentials",
          appkey: "app-key",
          appsecret: "app-secret",
        }),
      }),
    );
    expect(token.accessToken).toBe("token-123");
    expect(token.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });
});

describe("normalizeKisPrice", () => {
  it("maps KIS quote fields into the Pulsefolio quote shape", () => {
    const quote = normalizeKisPrice("005930", {
      stck_prpr: "78200",
      prdy_vrss: "1200",
      prdy_ctrt: "1.56",
      acml_vol: "1234567",
    });

    expect(quote).toMatchObject({
      symbol: "005930",
      price: 78200,
      change: 1200,
      changeRate: 1.56,
      volume: 1234567,
      stale: false,
      source: "kis",
    });
  });
});

describe("normalizeKisDailyCandle", () => {
  it("maps KIS daily chart fields into the Pulsefolio candle shape", () => {
    const candle = normalizeKisDailyCandle({
      stck_bsop_date: "20260618",
      stck_oprc: "77000",
      stck_hgpr: "78500",
      stck_lwpr: "76800",
      stck_clpr: "78200",
      acml_vol: "1234567",
    });

    expect(candle).toEqual({
      date: "2026-06-18",
      open: 77000,
      high: 78500,
      low: 76800,
      close: 78200,
      volume: 1234567,
    });
  });
});

describe("fetchKisQuotes", () => {
  it("fetches domestic stock quotes with the KIS current price TR ID", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      jsonResponse({
        rt_cd: "0",
        output: {
          stck_prpr: "78200",
          prdy_vrss: "1200",
          prdy_ctrt: "1.56",
          acml_vol: "1234567",
        },
      }),
    );

    const quotes = await fetchKisQuotes(
      {
        env: "virtual",
        baseUrl: "https://openapivts.koreainvestment.com:29443",
        appKey: "app-key",
        appSecret: "app-secret",
      },
      "token-123",
      ["005930"],
      fetcher,
    );

    expect(fetcher).toHaveBeenCalledWith(
      "https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=005930",
      expect.objectContaining({
        headers: expect.objectContaining({
          authorization: "Bearer token-123",
          appkey: "app-key",
          appsecret: "app-secret",
          tr_id: "FHKST01010100",
          custtype: "P",
        }),
      }),
    );
    expect(quotes).toHaveLength(1);
    expect(quotes[0]?.price).toBe(78200);
  });

  it("throws a typed error when KIS returns a business error", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      jsonResponse({
        rt_cd: "1",
        msg_cd: "EGW00123",
        msg1: "호출 제한",
      }),
    );

    await expect(
      fetchKisQuotes(
        {
          env: "virtual",
          baseUrl: "https://openapivts.koreainvestment.com:29443",
          appKey: "app-key",
          appSecret: "app-secret",
        },
        "token-123",
        ["005930"],
        fetcher,
      ),
    ).rejects.toBeInstanceOf(KisApiError);
  });
});

describe("fetchKisDailyCandles", () => {
  it("fetches daily chart data with the KIS daily item chart TR ID", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      jsonResponse({
        rt_cd: "0",
        output2: [
          {
            stck_bsop_date: "20260618",
            stck_oprc: "77000",
            stck_hgpr: "78500",
            stck_lwpr: "76800",
            stck_clpr: "78200",
            acml_vol: "1234567",
          },
        ],
      }),
    );

    const candles = await fetchKisDailyCandles(
      {
        env: "virtual",
        baseUrl: "https://openapivts.koreainvestment.com:29443",
        appKey: "app-key",
        appSecret: "app-secret",
      },
      "token-123",
      {
        symbol: "005930",
        startDate: "20260601",
        endDate: "20260618",
      },
      fetcher,
    );

    expect(fetcher).toHaveBeenCalledWith(
      "https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=005930&FID_INPUT_DATE_1=20260601&FID_INPUT_DATE_2=20260618&FID_PERIOD_DIV_CODE=D&FID_ORG_ADJ_PRC=1",
      expect.objectContaining({
        headers: expect.objectContaining({
          authorization: "Bearer token-123",
          tr_id: "FHKST03010100",
        }),
      }),
    );
    expect(candles).toEqual([
      {
        date: "2026-06-18",
        open: 77000,
        high: 78500,
        low: 76800,
        close: 78200,
        volume: 1234567,
      },
    ]);
  });
});

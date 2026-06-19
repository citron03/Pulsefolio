import { GET } from "@/app/api/chart/route";

describe("GET /api/chart", () => {
  it("returns mock candles locally when mock mode is enabled", async () => {
    const originalMock = process.env.NEXT_PUBLIC_USE_MOCK;
    process.env.NEXT_PUBLIC_USE_MOCK = "true";

    const response = await GET(new Request("http://localhost/api/chart?symbol=005930&range=1m"));
    const body = await response.json();

    process.env.NEXT_PUBLIC_USE_MOCK = originalMock;

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      status: "ready",
      source: "mock",
      symbol: "005930",
      range: "1m",
    });
    expect(body.data[0]).toEqual(
      expect.objectContaining({
        date: expect.any(String),
        open: expect.any(Number),
        high: expect.any(Number),
        low: expect.any(Number),
        close: expect.any(Number),
        volume: expect.any(Number),
      }),
    );
  });

  it("rejects a missing symbol request", async () => {
    const response = await GET(new Request("http://localhost/api/chart?range=1m"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.status).toBe("error");
  });
});

import { GET } from "@/app/api/quotes/route";

describe("GET /api/quotes", () => {
  it("returns mock quotes locally when mock mode is enabled", async () => {
    const originalMock = process.env.NEXT_PUBLIC_USE_MOCK;
    process.env.NEXT_PUBLIC_USE_MOCK = "true";

    const response = await GET(new Request("http://localhost/api/quotes?symbols=005930,000660"));
    const body = await response.json();

    process.env.NEXT_PUBLIC_USE_MOCK = originalMock;

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      status: "ready",
      source: "mock",
    });
    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          symbol: "005930",
          source: "mock",
          stale: false,
        }),
      ]),
    );
  });

  it("rejects an empty symbol request", async () => {
    const response = await GET(new Request("http://localhost/api/quotes"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.status).toBe("error");
  });
});

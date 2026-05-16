export type MarketStatus = "PRE_OPEN" | "LIVE" | "CLOSED";

export function getMarketStatus(now: Date): MarketStatus {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const open = 9 * 60;
  const close = 15 * 60 + 30;

  if (minutes < open) {
    return "PRE_OPEN";
  }

  if (minutes <= close) {
    return "LIVE";
  }

  return "CLOSED";
}

export function statusLabel(status: MarketStatus): string {
  if (status === "LIVE") return "LIVE";
  if (status === "PRE_OPEN") return "장 시작 전";
  return "장 종료";
}

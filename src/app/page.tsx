"use client";

import { useMemo, useState } from "react";
import { getMarketStatus, statusLabel } from "@/lib/market";
import { mockHoldings, mockIndexes, mockWatchlist } from "@/mock/dashboard";

type DataState = "loading" | "ready" | "empty" | "error" | "stale";

function changeClass(change: number): string {
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "flat";
}

function sign(change: number): string {
  if (change > 0) return "▲";
  if (change < 0) return "▼";
  return "-";
}

export default function HomePage() {
  const [state, setState] = useState<DataState>("ready");

  const status = getMarketStatus(new Date());
  const refreshedAt = new Date().toLocaleTimeString("ko-KR", { hour12: false });

  const summary = useMemo(() => {
    const principal = mockHoldings.reduce((acc, cur) => acc + cur.avgBuyPrice * cur.quantity, 0);
    const valuation = mockHoldings.reduce((acc, cur) => acc + cur.currentPrice * cur.quantity, 0);
    const profit = valuation - principal;
    const rate = principal === 0 ? 0 : (profit / principal) * 100;

    return { principal, valuation, profit, rate };
  }, []);

  const sortedHoldings = [...mockHoldings].sort(
    (a, b) =>
      (b.currentPrice - b.avgBuyPrice) / b.avgBuyPrice -
      (a.currentPrice - a.avgBuyPrice) / a.avgBuyPrice,
  );

  return (
    <main className="dashboard">
      <header className="hero">
        <div>
          <p className="eyebrow">Pulsefolio</p>
          <h1>내 투자, 한 눈에</h1>
        </div>
        <div className="statusWrap">
          <span className={`badge ${status === "LIVE" ? "live" : "closed"}`}>
            {statusLabel(status)}
          </span>
          <p>마지막 갱신 {refreshedAt}</p>
        </div>
      </header>

      <section className="statePanel">
        <strong>데이터 상태 시뮬레이션</strong>
        <div className="stateButtons">
          {(["loading", "ready", "empty", "error", "stale"] as DataState[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setState(v)}
              className={state === v ? "active" : ""}
            >
              {v}
            </button>
          ))}
        </div>
      </section>

      {state === "loading" && <section className="card">로딩 중입니다...</section>}
      {state === "error" && (
        <section className="card">데이터를 불러오지 못했습니다. 다시 시도해주세요.</section>
      )}
      {state === "empty" && (
        <section className="card">데이터가 없습니다. 보유 종목을 추가해 주세요.</section>
      )}

      {(state === "ready" || state === "stale") && (
        <>
          {state === "stale" && (
            <section className="card warning">현재 데이터는 최신이 아닐 수 있습니다.</section>
          )}

          <section className="summaryGrid">
            <article className="card">
              <h2>총 평가금액</h2>
              <p className="metric">₩{summary.valuation.toLocaleString()}</p>
            </article>
            <article className="card">
              <h2>투자 원금</h2>
              <p className="metric">₩{summary.principal.toLocaleString()}</p>
            </article>
            <article className="card">
              <h2>총 손익</h2>
              <p className={`metric ${changeClass(summary.profit)}`}>
                {sign(summary.profit)} ₩{Math.abs(summary.profit).toLocaleString()}
              </p>
            </article>
            <article className="card">
              <h2>총 수익률</h2>
              <p className={`metric ${changeClass(summary.rate)}`}>
                {sign(summary.rate)} {Math.abs(summary.rate).toFixed(2)}%
              </p>
            </article>
          </section>

          <section className="splitGrid">
            <article className="card">
              <h2>시장 지수</h2>
              <ul className="list">
                {mockIndexes.map((idx) => (
                  <li key={idx.label}>
                    <span>{idx.label}</span>
                    <span>
                      {idx.value.toLocaleString()},
                      <b className={changeClass(idx.changeRate)}>
                        {sign(idx.changeRate)} {Math.abs(idx.changeRate).toFixed(2)}%
                      </b>
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="card">
              <h2>관심 종목</h2>
              <ul className="list">
                {mockWatchlist.map((item) => (
                  <li key={item.symbol}>
                    <span>{item.name}</span>
                    <span>
                      ₩{item.price.toLocaleString()}:
                      <b className={changeClass(item.changeRate)}>
                        {sign(item.changeRate)} {Math.abs(item.changeRate).toFixed(2)}%
                      </b>
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="card">
            <h2>보유 종목 Top 5</h2>
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>종목명</th>
                    <th>현재가</th>
                    <th>평균단가</th>
                    <th>수익률</th>
                    <th>평가금액</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHoldings.slice(0, 5).map((h) => {
                    const rate = ((h.currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100;
                    return (
                      <tr key={h.symbol}>
                        <td>
                          {h.name} <small>{h.symbol}</small>
                        </td>
                        <td>₩{h.currentPrice.toLocaleString()}</td>
                        <td>₩{h.avgBuyPrice.toLocaleString()}</td>
                        <td className={changeClass(rate)}>
                          {sign(rate)} {Math.abs(rate).toFixed(2)}%
                        </td>
                        <td>₩{(h.currentPrice * h.quantity).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

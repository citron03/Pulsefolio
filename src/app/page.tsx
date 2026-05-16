"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getMarketStatus, statusLabel } from "@/lib/market";
import { mockIndexTrend, mockSparkline } from "@/mock/charts";
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

const PIE_COLORS = ["#2f6ea3", "#4a89bd", "#6aa5d8", "#8ac0e8", "#b7d8f1"];

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

  const allocation = mockHoldings.map((h) => ({
    name: h.name,
    value: h.currentPrice * h.quantity,
  }));

  const sortedHoldings = [...mockHoldings].sort(
    (a, b) =>
      (b.currentPrice - b.avgBuyPrice) / b.avgBuyPrice -
      (a.currentPrice - a.avgBuyPrice) / a.avgBuyPrice,
  );

  return (
    <main className="dashboard">
      <div className="bgOrb orbA" />
      <div className="bgOrb orbB" />

      <header className="hero card">
        <div>
          <p className="eyebrow">Pulsefolio</p>
          <h1>내 투자, 한 눈에</h1>
          <p className="subline">시세 모니터링과 포트폴리오 상태를 단일 화면에서 확인합니다.</p>
        </div>
        <div className="statusWrap">
          <span className={`badge ${status === "LIVE" ? "live" : "closed"}`}>
            {statusLabel(status)}
          </span>
          <p>마지막 갱신 {refreshedAt}</p>
        </div>
      </header>

      <section className="statePanel card">
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

      {state === "loading" && <section className="card info">로딩 중입니다...</section>}
      {state === "error" && (
        <section className="card danger">데이터를 불러오지 못했습니다. 다시 시도해주세요.</section>
      )}
      {state === "empty" && (
        <section className="card info">데이터가 없습니다. 보유 종목을 추가해 주세요.</section>
      )}

      {(state === "ready" || state === "stale") && (
        <>
          {state === "stale" && (
            <section className="card warning">현재 데이터는 최신이 아닐 수 있습니다.</section>
          )}

          <section className="summaryGrid">
            <article className="card metricCard">
              <h2>총 평가금액</h2>
              <p className="metric">₩{summary.valuation.toLocaleString()}</p>
            </article>
            <article className="card metricCard">
              <h2>투자 원금</h2>
              <p className="metric">₩{summary.principal.toLocaleString()}</p>
            </article>
            <article className="card metricCard">
              <h2>총 손익</h2>
              <p className={`metric ${changeClass(summary.profit)}`}>
                {sign(summary.profit)} ₩{Math.abs(summary.profit).toLocaleString()}
              </p>
            </article>
            <article className="card metricCard">
              <h2>총 수익률</h2>
              <p className={`metric ${changeClass(summary.rate)}`}>
                {sign(summary.rate)} {Math.abs(summary.rate).toFixed(2)}%
              </p>
            </article>
          </section>

          <section className="chartGrid">
            <article className="card elevated chartCard">
              <h2>자산 비중</h2>
              <div className="chartBox">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocation}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={56}
                      outerRadius={86}
                    >
                      {allocation.map((entry, index) => (
                        <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₩${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="card elevated chartCard">
              <h2>지수 추이 (Mock)</h2>
              <div className="chartBox">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockIndexTrend}>
                    <XAxis dataKey="t" tick={{ fontSize: 11 }} />
                    <YAxis hide />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="kospi"
                      stroke="#2f6ea3"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="kosdaq"
                      stroke="#8a4fd1"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          <section className="card elevated">
            <TabGroup>
              <TabList className="tabs">
                <Tab>시장 지수</Tab>
                <Tab>관심 종목</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
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
                </TabPanel>
                <TabPanel>
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
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </section>

          <section className="card elevated">
            <h2>보유 종목 Top 5</h2>
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>종목명</th>
                    <th>추이</th>
                    <th>현재가</th>
                    <th>평균단가</th>
                    <th>수익률</th>
                    <th>평가금액</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHoldings.slice(0, 5).map((h) => {
                    const rate = ((h.currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100;
                    const sparkData = (
                      mockSparkline[h.symbol as keyof typeof mockSparkline] ?? []
                    ).map((v, i) => ({
                      i,
                      v,
                    }));

                    return (
                      <tr key={h.symbol}>
                        <td>
                          {h.name} <small>{h.symbol}</small>
                        </td>
                        <td>
                          <div className="sparkline">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={sparkData}>
                                <Area
                                  type="monotone"
                                  dataKey="v"
                                  stroke={rate >= 0 ? "#c62828" : "#1f5ea8"}
                                  fill={rate >= 0 ? "rgba(198,40,40,0.16)" : "rgba(31,94,168,0.16)"}
                                  strokeWidth={1.5}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
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

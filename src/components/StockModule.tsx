import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  RefreshCw,
  ExternalLink,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { ChartRenderer } from "./visual/ChartRenderer.tsx";
import { ChartConfig } from "./visual/types.ts";

export const StockModule: React.FC = () => {
  const [ticker, setTicker] = useState("NVDA");
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  // Virtual Portfolio Simulation
  const [cashBalance, setCashBalance] = useState(100000);
  const [portfolio, setPortfolio] = useState<Record<string, { shares: number; avgPrice: number; currentPrice: number }>>({
    NVDA: { shares: 45, avgPrice: 128.5, currentPrice: 139.2 },
    AAPL: { shares: 60, avgPrice: 220.0, currentPrice: 231.5 },
    GOOGL: { shares: 50, avgPrice: 172.0, currentPrice: 178.4 },
  });

  const [tradeAmount, setTradeAmount] = useState(10);

  const popularTickers = ["NVDA", "AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "META"];

  const handleAnalyzeStock = async (symbol = ticker) => {
    if (!symbol.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/stock-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: symbol }),
      });
      const data = await res.json();
      setAnalysisData(data);
      if (data.quote && typeof data.quote.price === 'number') {
        setPortfolio((prev) => ({
          ...prev,
          [symbol]: {
            shares: prev[symbol]?.shares || 0,
            avgPrice: prev[symbol]?.avgPrice || data.quote.price,
            currentPrice: data.quote.price,
          },
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAnalyzeStock("NVDA");
  }, []);

  const currentHolding = portfolio[ticker] || { shares: 0, avgPrice: 0, currentPrice: 150 };

  const stockChartConfig: ChartConfig = React.useMemo(() => {
    const base = currentHolding.currentPrice || 140;
    const days = ["Oct 18", "Oct 19", "Oct 20", "Oct 21", "Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26", "Oct 27"];
    const pts = days.map((day, idx) => {
      const delta = Math.sin(idx * 0.8) * 8 + idx * 1.5;
      const close = parseFloat((base - 10 + delta).toFixed(2));
      const open = parseFloat((close - (idx % 2 === 0 ? 2.5 : -1.8)).toFixed(2));
      const high = parseFloat((Math.max(open, close) + 3.2).toFixed(2));
      const low = parseFloat((Math.min(open, close) - 2.8).toFixed(2));
      return {
        label: day,
        value: close,
        open,
        high,
        low,
        close,
      };
    });

    return {
      type: "candlestick",
      title: `${ticker} 10-Day Market Action (OHLC)`,
      description: "Interactive Price Structure with Multi-Chart Type Toggle",
      unit: "$",
      data: pts,
    };
  }, [ticker, currentHolding]);

  const handleBuy = () => {
    const cost = tradeAmount * currentHolding.currentPrice;
    if (cashBalance < cost) return;

    setCashBalance((prev) => prev - cost);
    setPortfolio((prev) => {
      const existing = prev[ticker] || { shares: 0, avgPrice: currentHolding.currentPrice, currentPrice: currentHolding.currentPrice };
      const totalShares = existing.shares + tradeAmount;
      const totalCost = existing.shares * existing.avgPrice + cost;
      return {
        ...prev,
        [ticker]: {
          shares: totalShares,
          avgPrice: totalCost / totalShares,
          currentPrice: currentHolding.currentPrice,
        },
      };
    });
  };

  const handleSell = () => {
    if (currentHolding.shares < tradeAmount) return;

    const proceeds = tradeAmount * currentHolding.currentPrice;
    setCashBalance((prev) => prev + proceeds);
    setPortfolio((prev) => {
      const existing = prev[ticker];
      const remaining = existing.shares - tradeAmount;
      if (remaining <= 0) {
        const copy = { ...prev };
        delete copy[ticker];
        return copy;
      }
      return {
        ...prev,
        [ticker]: {
          ...existing,
          shares: remaining,
        },
      };
    });
  };

  // Portfolio Total Calculations
  const portfolioEquity = Object.entries(portfolio).reduce((acc, [_, item]) => {
    return acc + item.shares * item.currentPrice;
  }, 0);

  const totalPortfolioValue = cashBalance + portfolioEquity;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">Live Stock Market & Portfolio Quant</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              🇮🇳 Made in India • Aryan Sharma
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Created by Aryan Sharma. Real-time Yahoo Finance market quotes, Search-grounded market intelligence, technical catalysts, and portfolio analytics.
          </p>
        </div>

        {/* Portfolio Stats Card */}
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Total Virtual Wealth:</span>
            <span className="font-bold text-emerald-300 font-mono text-sm">
              ${totalPortfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="pl-3 border-l border-slate-800">
            <span className="text-slate-400 block text-[10px]">Cash Reserve:</span>
            <span className="font-bold text-slate-200 font-mono text-xs">
              ${cashBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Ticker Search & Popular Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          {popularTickers.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTicker(t);
                handleAnalyzeStock(t);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                ticker === t
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyzeStock();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Enter ticker (e.g. MSFT)..."
              className="pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs uppercase font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
            <span>Analyze</span>
          </button>
        </form>
      </div>

      {/* Grid: Live Analysis + Trading Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulator Panel */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
                Virtual Trading Desk: {ticker}
              </span>
              <span className="font-mono text-xs font-bold text-slate-100">
                ${currentHolding.currentPrice.toFixed(2)}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Position:</span>
                <span className="font-mono font-bold text-slate-200">{currentHolding.shares} Shares</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Average Basis:</span>
                <span className="font-mono text-slate-200">${currentHolding.avgPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Position Value:</span>
                <span className="font-mono font-bold text-emerald-300">
                  ${(currentHolding.shares * currentHolding.currentPrice).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Trading Controls */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Order Quantity:</span>
                <div className="flex items-center gap-1">
                  {[5, 10, 25, 50].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setTradeAmount(qty)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        tradeAmount === qty ? "bg-cyan-500 text-white" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleBuy}
                  disabled={cashBalance < tradeAmount * currentHolding.currentPrice}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 disabled:opacity-50"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Buy {tradeAmount} {ticker}
                </button>
                <button
                  type="button"
                  onClick={handleSell}
                  disabled={currentHolding.shares < tradeAmount}
                  className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/40 disabled:opacity-50"
                >
                  <ArrowDownRight className="w-4 h-4" />
                  Sell {tradeAmount} {ticker}
                </button>
              </div>
            </div>
          </div>

          {/* Portfolio Holdings Summary */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
            <h4 className="font-bold text-xs text-slate-300 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-cyan-400" />
              Active Portfolio Holdings
            </h4>
            <div className="space-y-2 text-xs">
              {Object.entries(portfolio).map(([sym, item]) => (
                <div key={sym} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <div>
                    <span className="font-bold text-slate-100">{sym}</span>
                    <span className="text-slate-400 block text-[10px]">{item.shares} Shares @ ${item.avgPrice.toFixed(1)}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-300 font-mono">${(item.shares * item.currentPrice).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Search-Grounded Financial Intelligence */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Real-Time Search Grounded Analysis: {analysisData?.ticker || ticker}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-400">
              Live Google Search Grounding
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-xs text-emerald-300">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Querying financial data & grounding market catalysts...</span>
            </div>
          ) : analysisData ? (
            <div className="space-y-4">
              <ChartRenderer config={stockChartConfig} />

              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans space-y-3">
                {analysisData.analysis}
              </div>

              {analysisData.sources && analysisData.sources.length > 0 && (
                <div className="pt-3 border-t border-slate-800 space-y-1.5">
                  <p className="text-[11px] font-bold text-emerald-400">Cited Market Intelligence Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.sources.map((src: any, i: number) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors"
                      >
                        <span className="truncate max-w-[240px]">{src.title}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-12 text-center">Select or enter a ticker to inspect real-time financial intelligence.</p>
          )}
        </div>
      </div>
    </div>
  );
};

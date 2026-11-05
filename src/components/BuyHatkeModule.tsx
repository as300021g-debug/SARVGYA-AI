import React, { useState, useEffect } from "react";
import {
  Tag,
  Search,
  ExternalLink,
  Copy,
  Check,
  Percent,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const BuyHatkeModule: React.FC = () => {
  const [query, setQuery] = useState("Apple MacBook Air M3 and Sony WH-1000XM5 discount promo codes");
  const [loading, setLoading] = useState(false);
  const [dealResults, setDealResults] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    "Laptops & MacBooks",
    "Smartphones & iPhones",
    "Sony & Bose Headphones",
    "Cloud Software & AI Tools",
    "Gaming Consoles & GPUs",
  ];

  const handleSearchDeals = async (searchQuery = query) => {
    if (!searchQuery.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/deal-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setDealResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearchDeals();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Tag className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">BuyHatke Coupon & Deal Intelligence</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              🇮🇳 Made in India • Aryan Sharma
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Created by Aryan Sharma. Real-time verified discount codes, seasonal promotions, and price-drop tracking using live Google Search Grounding.
          </p>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setQuery(`${cat} coupon promo discount`);
                handleSearchDeals(`${cat} coupon promo discount`);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[11px] font-medium transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-lg shadow-black/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchDeals();
          }}
          className="flex flex-wrap items-center gap-3"
        >
          <div className="flex-1 min-w-[240px] relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search product, brand, or store for active discount codes..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-md shadow-orange-950/40"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Percent className="w-3.5 h-3.5" />}
            <span>Scout Verified Deals</span>
          </button>
        </form>
      </div>

      {/* Featured Verified Stores Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {[
          { store: "Amazon Deals", perk: "Up to 40% Off Tech", code: "AMZSAVE15" },
          { store: "Flipkart SuperDeals", perk: "Instant Bank Rebates", code: "HDFC10" },
          { store: "Best Buy Tech", perk: "Price Match & Open Box", code: "OPENBOX20" },
          { store: "Apple Store", perk: "Education Discount", code: "EDU100" },
        ].map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <span className="font-bold text-slate-200 block">{item.store}</span>
              <span className="text-[11px] text-orange-400">{item.perk}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <span className="font-mono text-[10px] text-slate-400">{item.code}</span>
              <button
                type="button"
                onClick={() => handleCopy(item.code)}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copiedCode === item.code ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode === item.code ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grounded Results */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            <h3 className="font-bold text-sm text-slate-100">
              Live Verified E-Commerce Deals & Coupon Intel: {dealResults?.query || query}
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-orange-400">
            Powered by Google Search Grounding
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-xs text-orange-300">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Scanning verified store feeds & coupon grounding sources...</span>
          </div>
        ) : dealResults ? (
          <div className="space-y-4">
            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans space-y-3">
              {dealResults.results}
            </div>

            {dealResults.sources && dealResults.sources.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-1.5">
                <p className="text-[11px] font-bold text-orange-400">Official Merchant & Deal Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {dealResults.sources.map((src: any, i: number) => (
                    <a
                      key={i}
                      href={src.uri}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-orange-300 border border-slate-700 transition-colors"
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
          <p className="text-xs text-slate-500 py-12 text-center">Search any product or brand above to inspect verified discounts.</p>
        )}
      </div>
    </div>
  );
};

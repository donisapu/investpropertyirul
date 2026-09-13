import React, { useState, useEffect } from "react";

export default function Calculator({ landings, projects = [] }) {
  // Set default state property ke nama project pertama (jika ada)
  const [property, setProperty] = useState("");
  const [paymentType, setPaymentType] = useState("oneTime");
  const [investmentAmount, setInvestmentAmount] = useState(1000000);
  const [period, setPeriod] = useState(5);
  const [yieldType, setYieldType] = useState("lastMonth");
  const [autoReinvest, setAutoReinvest] = useState(false);

  // Update nilai default property saat data projects dimuat
  useEffect(() => {
    if (projects && projects.length > 0) {
      setProperty(projects[0].name || projects[0].title || "");
    }
  }, [projects]);

  const tokenPrice = 10000;
  const eryRate = 0.08;

  const tokensCount = Math.floor((Number(investmentAmount) || 0) / tokenPrice);
  const estimatedRentalYield = (Number(investmentAmount) || 0) * eryRate * period;
  const totalAssets = (Number(investmentAmount) || 0) + estimatedRentalYield;

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka).replace("Rp", "IDR");
  };

  return (
    <div className="bg-zinc-900 text-zinc-100 p-8 rounded-3xl max-w-5xl mx-auto my-12 font-sans border border-zinc-800 shadow-2xl">
      <h2 className="text-3xl font-extrabold text-[#D4AF37] text-center mb-8 tracking-wide uppercase">
        Return Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column */}
        <div className="space-y-6 bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
          {/* Select Property (Dinamis dari database) */}
          <div>
            <label className="block text-sm font-bold text-zinc-300 mb-2">
              Select Property
            </label>
            <div className="relative">
              <select
                value={property}
                onChange={(e) => setProperty(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 font-semibold appearance-none focus:outline-none focus:border-[#D4AF37] transition-colors"
              >
                {projects && projects.length > 0 ? (
                  projects.map((item, index) => (
                    <option key={item.id || index} value={item.name || item.title}>
                      {item.name || item.title}
                    </option>
                  ))
                ) : (
                  <option value="">Tidak ada properti tersedia</option>
                )}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37] text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Payment Type Toggle */}
          <div className="bg-zinc-900 p-1 rounded-full flex border border-zinc-800">
            <button
              type="button"
              onClick={() => setPaymentType("oneTime")}
              className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                paymentType === "oneTime"
                  ? "bg-[#D4AF37] text-zinc-950 shadow-md font-extrabold"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              One Time
            </button>
            <button
              type="button"
              onClick={() => setPaymentType("monthly")}
              className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                paymentType === "monthly"
                  ? "bg-[#D4AF37] text-zinc-950 shadow-md font-extrabold"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Initial Investment Amount */}
          <div>
            <label className="block text-sm font-bold text-zinc-300 mb-2">
              Initial Investment Amount (IDR)
            </label>
            <input
              type="number"
              step="10000"
              placeholder="Multiple of IDR 10,000"
              value={investmentAmount || ""}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 font-medium placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          {/* Period Slider */}
          <div>
            <label className="block text-sm font-bold text-zinc-300 mb-2">
              Period ({period} year)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
          </div>

          {/* Expected Rental Yield */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-zinc-300">
                Expected Rental Yield (ERY)
              </label>
              <span className="text-3xl font-extrabold text-[#D4AF37]">8%</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-300">
                <input
                  type="radio"
                  name="yieldType"
                  checked={yieldType === "lastMonth"}
                  onChange={() => setYieldType("lastMonth")}
                  className="accent-[#D4AF37] w-4 h-4"
                />
                Last Month
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-300">
                <input
                  type="radio"
                  name="yieldType"
                  checked={yieldType === "average"}
                  onChange={() => setYieldType("average")}
                  className="accent-[#D4AF37] w-4 h-4"
                />
                Average
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-300 pt-1">
                <input
                  type="checkbox"
                  checked={autoReinvest}
                  onChange={(e) => setAutoReinvest(e.target.checked)}
                  className="accent-[#D4AF37] w-4 h-4 rounded"
                />
                Auto reinvest rental income
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold border border-zinc-700">
                  i
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="bg-zinc-950 rounded-2xl p-6 text-center border border-zinc-800 shadow-lg">
            <div className="bg-zinc-900 border border-zinc-800 py-3 rounded-xl mb-6">
              <h3 className="text-base font-bold text-[#D4AF37] uppercase tracking-wider">
                Projected Income
              </h3>
            </div>

            <p className="text-sm font-medium text-zinc-300 mb-4">
              Investment of <span className="text-zinc-100 font-bold">{formatRupiah(investmentAmount)}</span> = <span className="text-[#D4AF37] font-bold">{tokensCount.toLocaleString("id-ID")} Token</span>
            </p>

            <p className="text-sm font-medium text-zinc-400">
              Estimated rental yield to be received in <span className="font-bold text-zinc-200">{period} years</span>
            </p>

            <div className="mt-3 mb-1 text-3xl font-black text-[#D4AF37] tracking-tight">
              {formatRupiah(estimatedRentalYield)}
            </div>
            <p className="text-xs font-semibold text-zinc-400">
              ({tokensCount.toLocaleString("id-ID")} Token)
            </p>
          </div>

          <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800 shadow-md">
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
              Total assets in <span className="text-zinc-200">{period} years</span>
            </p>
            <div className="text-3xl font-black text-zinc-100 mt-2">
              {formatRupiah(totalAssets)}
            </div>
            <p className="text-xs font-semibold text-[#D4AF37] mt-1">
              ({tokensCount.toLocaleString("id-ID")} Token)
            </p>
          </div>

          <button
            type="button"
            className="w-full bg-[#D4AF37] hover:bg-[#b5932c] text-zinc-950 font-black py-4 rounded-xl transition-all shadow-lg hover:shadow-[#D4AF37]/10 uppercase tracking-wider text-sm"
          >
            Invest Now
          </button>
        </div>
      </div>

      <p className="text-[11px] text-zinc-500 mt-8 leading-relaxed text-center">
        <strong className="text-zinc-400">Disclaimer:</strong> The calculator is intended solely for illustrative purposes, and the generated information should not be construed as legal or financial advice, nor as a guarantee of any kind.
      </p>
    </div>
  );
}
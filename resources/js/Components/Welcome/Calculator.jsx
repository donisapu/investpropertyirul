import React, { useState, useEffect } from "react";

export default function Calculator({ landings, projects = [] }) {
  const [property, setProperty] = useState("");
  const [paymentType, setPaymentType] = useState("oneTime");
  const [investmentAmount, setInvestmentAmount] = useState(1000000);
  const [period, setPeriod] = useState(5);
  const [yieldType, setYieldType] = useState("lastMonth");
  const [autoReinvest, setAutoReinvest] = useState(false);

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
    <div className="bg-slate-50 text-slate-800 p-8 rounded-3xl max-w-5xl mx-auto my-12 font-sans border border-slate-200 shadow-xl">
      {/* Title with Gold Gradient Text */}
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-center mb-8 tracking-wide uppercase drop-shadow-sm">
        Return Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {/* Select Property */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Select Property
            </label>
            <div className="relative">
              <select
                value={property}
                onChange={(e) => setProperty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-semibold appearance-none focus:outline-none focus:border-[#AA771C] transition-colors"
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
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#AA771C] text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Payment Type Toggle */}
          <div className="bg-slate-100 p-1 rounded-full flex border border-slate-200">
            <button
              type="button"
              onClick={() => setPaymentType("oneTime")}
              className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                paymentType === "oneTime"
                  ? "bg-gradient-to-r from-[#BF953F] via-[#AA771C] to-[#865811] text-white shadow-md font-extrabold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              One Time
            </button>
            <button
              type="button"
              onClick={() => setPaymentType("monthly")}
              className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                paymentType === "monthly"
                  ? "bg-gradient-to-r from-[#BF953F] via-[#AA771C] to-[#865811] text-white shadow-md font-extrabold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Initial Investment Amount */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Initial Investment Amount (IDR)
            </label>
            <input
              type="number"
              step="10000"
              placeholder="Multiple of IDR 10,000"
              value={investmentAmount || ""}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:border-[#AA771C] transition-colors"
            />
          </div>

          {/* Period Slider */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Period ({period} year)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#AA771C]"
            />
          </div>

          {/* Expected Rental Yield */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-slate-700">
                Expected Rental Yield (ERY)
              </label>
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] to-[#AA771C]">
                8%
              </span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="radio"
                  name="yieldType"
                  checked={yieldType === "lastMonth"}
                  onChange={() => setYieldType("lastMonth")}
                  className="accent-[#AA771C] w-4 h-4"
                />
                Last Month
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="radio"
                  name="yieldType"
                  checked={yieldType === "average"}
                  onChange={() => setYieldType("average")}
                  className="accent-[#AA771C] w-4 h-4"
                />
                Average
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 pt-1">
                <input
                  type="checkbox"
                  checked={autoReinvest}
                  onChange={(e) => setAutoReinvest(e.target.checked)}
                  className="accent-[#AA771C] w-4 h-4 rounded"
                />
                Auto reinvest rental income
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold border border-slate-300">
                  i
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Projection & Summary */}
        <div className="space-y-4">
          {/* Main Projection Box */}
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 shadow-sm">
            <div className="bg-slate-100 border border-slate-200 py-3 rounded-xl mb-6">
              <h3 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] to-[#AA771C] uppercase tracking-wider">
                Projected Income
              </h3>
            </div>

            <p className="text-sm font-medium text-slate-600 mb-4">
              Investment of <span className="text-slate-900 font-bold">{formatRupiah(investmentAmount)}</span> = <span className="text-[#AA771C] font-bold">{tokensCount.toLocaleString("id-ID")} Token</span>
            </p>

            <p className="text-sm font-medium text-slate-500">
              Estimated rental yield to be received in <span className="font-bold text-slate-800">{period} years</span>
            </p>

            <div className="mt-3 mb-1 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#AA771C] to-[#865811] tracking-tight">
              {formatRupiah(estimatedRentalYield)}
            </div>
            <p className="text-xs font-semibold text-slate-500">
              ({tokensCount.toLocaleString("id-ID")} Token)
            </p>
          </div>

          {/* Total Assets Summary Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Total assets in <span className="text-slate-800">{period} years</span>
            </p>
            <div className="text-3xl font-black text-slate-900 mt-2">
              {formatRupiah(totalAssets)}
            </div>
            <p className="text-xs font-semibold text-[#AA771C] mt-1">
              ({tokensCount.toLocaleString("id-ID")} Token)
            </p>
          </div>

          {/* CTA Button with Gold Gradient */}
          <button
            type="button"
            className="w-full bg-gradient-to-r from-[#BF953F] via-[#AA771C] to-[#865811] hover:brightness-110 text-white font-black py-4 rounded-xl transition-all shadow-lg hover:shadow-[#BF953F]/20 uppercase tracking-wider text-sm"
          >
            Invest Now
          </button>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <p className="text-[11px] text-slate-400 mt-8 leading-relaxed text-center">
        <strong className="text-slate-600">Disclaimer:</strong> The calculator is intended solely for illustrative purposes, and the generated information should not be construed as legal or financial advice, nor as a guarantee of any kind.
      </p>
    </div>
  );
}
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

  /*
   * CATATAN: `yieldType` (Last Month / Average) dan `autoReinvest` saat ini
   * belum memengaruhi perhitungan mana pun — eryRate dipatok 0,08. Kontrolnya
   * dipertahankan sesuai mockup, tetapi angkanya tidak berubah saat diubah.
   * Perlu rumus dari tim sebelum keduanya bisa benar-benar berfungsi.
   */
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
    <section
      aria-labelledby="calculator-heading"
      className="w-full bg-cream-sink px-6 py-16 sm:px-10 lg:px-[72px] lg:py-20"
    >
      <div className="mx-auto max-w-[1440px] font-sans text-ink">
      {/* Title with Gold Gradient Text */}
      <h2 id="calculator-heading" className="mb-8 text-[12px] font-bold uppercase leading-[19px] tracking-[1.5px] text-gold-ink">
        Return Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Kolom kiri: kontrol langsung di atas ground, tanpa kartu pembungkus */}
        <div className="flex flex-col gap-6">
          {/* Pilih properti */}
          <div className="relative">
            <label htmlFor="calc-property" className="sr-only">
              Select Property
            </label>
            <select
              id="calc-property"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              className="w-full appearance-none rounded-xl bg-white px-5 py-4 text-[15px] leading-[23px] text-ink transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-ink"
            >
              {projects && projects.length > 0 ? (
                projects.map((item, index) => (
                  <option key={item.id || index} value={item.name || item.title}>
                    {item.name || item.title}
                  </option>
                ))
              ) : (
                <option value="">Select Property</option>
              )}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[11px] text-ink"
            >
              &#9660;
            </span>
          </div>

          {/* Frekuensi — dua pill terpisah */}
          <div
            role="radiogroup"
            aria-label="Frekuensi investasi"
            className="grid grid-cols-2 gap-3"
          >
            {[
              { id: "oneTime", label: "One Time" },
              { id: "monthly", label: "Monthly" },
            ].map((opt) => {
              const active = paymentType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setPaymentType(opt.id)}
                  className={`rounded-[40px] py-3.5 text-[13px] font-semibold uppercase leading-5 tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink ${
                    active
                      ? "bg-ink text-cream"
                      : "bg-white text-ink hover:bg-cream"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Nominal investasi */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="calc-amount"
              className="text-[13px] leading-5 text-ink-soft"
            >
              Initial Investment Amount (IDR)
            </label>
            <input
              id="calc-amount"
              type="number"
              min="0"
              step="100000"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              className="w-full rounded-xl bg-white px-5 py-4 text-[20px] leading-7 text-ink transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-ink"
            />
          </div>

          {/* Periode — track datar, isian emas */}
          <div className="flex flex-col gap-3">
            <label
              htmlFor="calc-period"
              className="text-[13px] leading-5 text-ink-soft"
            >
              Period ({period} year)
            </label>
            <input
              id="calc-period"
              type="range"
              min="1"
              max="10"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="calc-range h-[3px] w-full cursor-pointer appearance-none rounded-full focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-ink"
              style={{
                background: `linear-gradient(to right, #C7A45C 0%, #C7A45C ${
                  ((period - 1) / 9) * 100
                }%, #DDDCD3 ${((period - 1) / 9) * 100}%, #DDDCD3 100%)`,
              }}
            />
          </div>

          {/* Imbal hasil */}
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] leading-[23px] text-ink">
                Expected Rental Yield (ERY)
              </span>
              <span className="text-[20px] font-semibold leading-7 text-ink">
                {Math.round(eryRate * 100)}%
              </span>
            </div>

            {/*
             * Sumber acuan ERY. Versi sebelumnya hanya dua label teks dengan
             * garis bawah — terbaca seperti tautan, bukan pilihan. Sekarang
             * memakai titik radio emas: afordansi "pilih salah satu" langsung
             * terbaca, tapi tetap ringan karena tanpa kotak atau bingkai.
             */}
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-2 text-[12px] leading-[19px] text-ink-soft">
                Dihitung dari
              </legend>
              <div
                role="radiogroup"
                aria-label="Dasar perhitungan imbal hasil"
                className="flex flex-wrap items-center gap-x-7 gap-y-1"
              >
                {[
                  { id: "lastMonth", label: "Last Month" },
                  { id: "average", label: "Average" },
                ].map((opt) => {
                  const active = yieldType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setYieldType(opt.id)}
                      className="group/opt -my-2 flex min-h-[44px] items-center gap-2.5 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink"
                    >
                      <span
                        aria-hidden="true"
                        className={`relative flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-colors duration-200 ${
                          active
                            ? "bg-white ring-gold"
                            : "bg-white ring-ink/25 group-hover/opt:ring-gold/60"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full bg-gold transition-transform duration-200 ease-out ${
                            active ? "scale-100" : "scale-0"
                          }`}
                        />
                      </span>
                      <span
                        className={`text-[13px] leading-5 transition-colors ${
                          active
                            ? "font-semibold text-ink"
                            : "text-ink-soft group-hover/opt:text-ink"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          {/* Auto reinvest — sakelar emas */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              role="switch"
              aria-checked={autoReinvest}
              onClick={() => setAutoReinvest(!autoReinvest)}
              className="group -my-2.5 flex min-h-[44px] items-center gap-3 py-2.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink"
            >
              <span
                aria-hidden="true"
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                  autoReinvest ? "bg-gold" : "bg-gold-line"
                }`}
              >
                <span
                  className={`absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    autoReinvest ? "left-[23px]" : "left-[3px]"
                  }`}
                />
              </span>
              <span className="text-[13px] leading-5 text-ink">
                Auto reinvest rental income
              </span>
            </button>

            <span
              title="Imbal hasil sewa otomatis diinvestasikan kembali setiap periode."
              className="flex h-5 w-5 shrink-0 cursor-help items-center justify-center rounded-full border border-gold-line text-[11px] font-semibold text-ink-soft"
            >
              i
            </span>
          </div>
        </div>

        {/* Kolom kanan: satu panel gelap sesuai mockup */}
        <div className="flex flex-col gap-5 rounded-2xl bg-ink p-7 text-cream sm:p-8">
          <h3 className="text-[12px] font-bold uppercase leading-[19px] tracking-[1.5px] text-gold">
            Projected Income
          </h3>

          <p className="text-[15px] leading-[23px] text-cream/80">
            Investment of{" "}
            <span className="font-semibold text-cream">
              {formatRupiah(investmentAmount)}
            </span>{" "}
            ={" "}
            <span className="font-semibold text-gold">
              {tokensCount.toLocaleString("id-ID")} Token
            </span>
          </p>

          <p className="text-[15px] leading-[23px] text-cream/80">
            Estimated rental yield to be received in{" "}
            <span className="font-semibold text-cream">{period} years</span>
          </p>

          <div>
            <p className="text-[clamp(1.75rem,3.5vw,2.25rem)] font-semibold leading-tight text-cream">
              {formatRupiah(estimatedRentalYield)}
            </p>
            <p className="mt-1 text-xs text-cream/60">
              ({tokensCount.toLocaleString("id-ID")} Token)
            </p>
          </div>

          <hr className="border-white/15" />

          <div>
            <p className="text-[12px] font-bold uppercase leading-[19px] tracking-[1.5px] text-cream/70">
              Total assets in {period} years
            </p>
            <p className="mt-2 text-[clamp(1.75rem,3.5vw,2.25rem)] font-semibold leading-tight text-gold">
              {formatRupiah(totalAssets)}
            </p>
            <p className="mt-1 text-xs text-cream/60">
              ({tokensCount.toLocaleString("id-ID")} Token)
            </p>
          </div>

          <button
            type="button"
            className="mt-auto w-full rounded-[40px] bg-gold py-4 text-sm font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-gold/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            Invest Now
          </button>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <p className="mt-8 text-[11px] leading-relaxed text-ink-soft">
        <strong className="text-ink-soft">Disclaimer:</strong> The calculator is intended solely for illustrative purposes, and the generated information should not be construed as legal or financial advice, nor as a guarantee of any kind.
      </p>
      </div>
    </section>
  );
}

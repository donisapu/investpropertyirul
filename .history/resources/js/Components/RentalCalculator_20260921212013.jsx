import React, { useState } from "react";

export default function RentalCalculator() {
    const [price, setPrice] = useState(2500000000);
    const [nightly, setNightly] = useState(1500000);
    const [occupancy, setOccupancy] = useState(60);

    const monthlyCharges = 12000000;

    const grossMonthly =
        (Number(nightly) * 365 * (Number(occupancy) / 100)) / 12;
    const netMonthly = grossMonthly - monthlyCharges;

    const roi = price > 0 ? ((netMonthly * 12) / Number(price)) * 100 : 0;

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(angka);
    };

    const priceMin = 100000000;
    const priceMax = 10000000000;
    const nightlyMin = 100000;
    const nightlyMax = 10000000;
    const occupancyMin = 10;
    const occupancyMax = 100;

    const pricePct = ((price - priceMin) / (priceMax - priceMin)) * 100;
    const nightlyPct =
        ((nightly - nightlyMin) / (nightlyMax - nightlyMin)) * 100;
    const occupancyPct =
        ((occupancy - occupancyMin) / (occupancyMax - occupancyMin)) * 100;

    const trackGradient = (pct) =>
        `linear-gradient(to right, #C7A45C 0%, #C7A45C ${pct}%, #DDDCD3 ${pct}%, #DDDCD3 100%)`;

    return (
        <div className="bg-white rounded-3xl p-8 border border-gold-line shadow-xl shadow-cream/50 mt-16 max-w-4xl mx-auto">
            <h3 className="mb-8 text-[12px] font-bold uppercase leading-[19px] tracking-[1.5px] text-gold-ink">
                Simulasi Cuan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Kolom kiri: kontrol */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <label
                            htmlFor="rental-price"
                            className="text-[13px] leading-5 text-ink-soft"
                        >
                            Harga Beli ({formatRupiah(price)})
                        </label>
                        <input
                            id="rental-price"
                            type="range"
                            min={priceMin}
                            max={priceMax}
                            step="50000000"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="calc-range h-11 w-full cursor-pointer appearance-none bg-transparent focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-ink"
                            style={{
                                backgroundImage: trackGradient(pricePct),
                                backgroundSize: "100% 3px",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label
                            htmlFor="rental-nightly"
                            className="text-[13px] leading-5 text-ink-soft"
                        >
                            Sewa per Malam ({formatRupiah(nightly)})
                        </label>
                        <input
                            id="rental-nightly"
                            type="range"
                            min={nightlyMin}
                            max={nightlyMax}
                            step="50000"
                            value={nightly}
                            onChange={(e) => setNightly(e.target.value)}
                            className="calc-range h-11 w-full cursor-pointer appearance-none bg-transparent focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-ink"
                            style={{
                                backgroundImage: trackGradient(nightlyPct),
                                backgroundSize: "100% 3px",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label
                            htmlFor="rental-occupancy"
                            className="text-[13px] leading-5 text-ink-soft"
                        >
                            Tingkat Okupansi ({occupancy}%)
                        </label>
                        <input
                            id="rental-occupancy"
                            type="range"
                            min={occupancyMin}
                            max={occupancyMax}
                            value={occupancy}
                            onChange={(e) => setOccupancy(e.target.value)}
                            className="calc-range h-11 w-full cursor-pointer appearance-none bg-transparent focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-ink"
                            style={{
                                backgroundImage: trackGradient(occupancyPct),
                                backgroundSize: "100% 3px",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                        />
                    </div>
                </div>

                {/* Kolom kanan: panel hasil gelap */}
                <div className="flex flex-col gap-5 rounded-2xl bg-ink p-7 text-cream sm:p-8">
                    <h4 className="text-[12px] font-bold uppercase leading-[19px] tracking-[1.5px] text-gold">
                        Hasil Simulasi
                    </h4>

                    <div>
                        <p className="text-[12px] font-bold uppercase leading-[19px] tracking-[1.5px] text-cream/70">
                            Net Monthly Income
                        </p>
                        <p className="mt-2 text-[clamp(1.75rem,3.5vw,2.25rem)] font-semibold leading-tight text-cream">
                            {netMonthly < 0 ? "-" : ""}
                            {formatRupiah(Math.abs(netMonthly))}
                        </p>
                    </div>

                    <hr className="border-white/15" />

                    <div>
                        <p className="text-[12px] font-bold uppercase leading-[19px] tracking-[1.5px] text-cream/70">
                            Estimasi ROI Tahunan
                        </p>
                        <p className="mt-2 text-[clamp(1.75rem,3.5vw,2.25rem)] font-semibold leading-tight text-gold">
                            {roi.toFixed(2)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Disclaimer */}
            <p className="mt-8 text-[12px] leading-relaxed text-ink-soft sm:text-[11px]">
                <strong className="text-ink-soft">Catatan:</strong> Simulasi
                ini hanya estimasi kasar dan tidak dimaksudkan sebagai saran
                keuangan.
            </p>
        </div>
    );
}

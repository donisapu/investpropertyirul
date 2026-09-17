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

    return (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100/50 mt-16 max-w-4xl mx-auto">
            <h3 className="text-2xl font-black text-slate-900 mb-8 text-center">
                Simulasi Cuan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">
                            Harga Beli: {formatRupiah(price)}
                        </label>
                        <input
                            type="range"
                            min="100000000"
                            max="10000000000"
                            step="50000000"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">
                            Sewa per Malam: {formatRupiah(nightly)}
                        </label>
                        <input
                            type="range"
                            min="100000"
                            max="10000000"
                            step="50000"
                            value={nightly}
                            onChange={(e) => setNightly(e.target.value)}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">
                            Tingkat Okupansi: {occupancy}%
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={occupancy}
                            onChange={(e) => setOccupancy(e.target.value)}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                    </div>
                </div>

                {/* Bagian Hasil */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between">
                    <div>
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">
                            Net Monthly Income
                        </p>
                        <h4 className="text-3xl font-black text-emerald-400">
                            {netMonthly < 0 ? "-" : ""}
                            {formatRupiah(Math.abs(netMonthly))}
                        </h4>
                    </div>
                    <div className="mt-6 border-t border-slate-700 pt-6">
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">
                            Estimasi ROI Tahunan
                        </p>
                        <div className="text-5xl font-black">
                            {roi.toFixed(2)}%
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-6 text-center italic">
                *Simulasi ini hanya estimasi kasar.
            </p>
        </div>
    );
}

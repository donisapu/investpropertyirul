import React, { useState } from 'react';

export default function RentalCalculator() {
    const [price, setPrice] = useState(150);
    const [nightly, setNightly] = useState(150);
    const [occupancy, setOccupancy] = useState(60);

    const monthlyCharges = 788.63;
    const grossMonthly = (nightly * 365 * (occupancy / 100)) / 12;
    const netMonthly = grossMonthly - monthlyCharges;
    const roi = ((netMonthly * 12) / (price * 1000)) * 100;

    return (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100/50 mt-16 max-w-4xl mx-auto">
            <h3 className="text-2xl font-black text-slate-900 mb-8 text-center">Simulasi Cuan</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Bagian Input */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Harga Beli (k USD): {price}K $</label>
                        <input type="range" min="50" max="1000" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Sewa per Malam ($): {nightly} $</label>
                        <input type="range" min="50" max="500" value={nightly} onChange={(e) => setNightly(e.target.value)} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Tingkat Okupansi (%): {occupancy}%</label>
                        <input type="range" min="10" max="100" value={occupancy} onChange={(e) => setOccupancy(e.target.value)} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                    </div>
                </div>

                {/* Bagian Hasil */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between">
                    <div>
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Net Monthly Income</p>
                        <h4 className="text-4xl font-black text-emerald-400">{netMonthly.toFixed(2)} $</h4>
                    </div>
                    <div className="mt-6 border-t border-slate-700 pt-6">
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Estimasi ROI Tahunan</p>
                        <div className="text-5xl font-black">{roi.toFixed(2)}%</div>
                    </div>
                </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-6 text-center italic">*Simulasi ini hanya estimasi kasar</p>
        </div>
    );
}

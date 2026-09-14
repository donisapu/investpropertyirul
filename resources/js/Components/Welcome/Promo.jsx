import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";

/*
 * Promo / campaign — dipisahkan dari Footer.jsx.
 *
 * Sebelumnya blok ini tinggal di dalam <footer>, dan penjaganya
 * (`if (!campaigns) return null`) ikut menyembunyikan SELURUH footer bila
 * tidak ada campaign aktif. Sekarang campaign punya seksinya sendiri,
 * sehingga footer selalu tampil.
 */
export default function Promo({ campaigns }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    useEffect(() => {
        if (!campaigns || campaigns.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === campaigns.length - 1 ? 0 : prev + 1,
            );
        }, 5000);
        return () => clearInterval(timer);
    }, [campaigns]);

    if (!campaigns || campaigns.length === 0) return null;

    const prevSlide = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) =>
            prev === 0 ? campaigns.length - 1 : prev - 1,
        );
    };

    const nextSlide = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) =>
            prev === campaigns.length - 1 ? 0 : prev + 1,
        );
    };

    const getCtaUrl = (campaign) => {
        const targetId = campaign.target_id || campaign.property_id;
        const discount = parseFloat(campaign.discount_percent || 0);
        if (campaign.type === "investment") {
            return `/investments/purchase/${targetId}?discount=${discount}&campaign_id=${campaign.id}`;
        }
        if (campaign.type === "crowdfunding") {
            return `/crowdfunding/purchase/${targetId}?discount=${discount}&campaign_id=${campaign.id}`;
        }
        return "#";
    };

    return (
        <section
            aria-label="Promo berjalan"
            className="w-full bg-cream text-ink"
        >
            <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 lg:px-[72px] lg:py-20">
                <p className="mb-7 text-[11px] uppercase leading-[17px] tracking-[1.5px] text-gold-ink">
                    {campaigns[0]?.title ?? "Promo"}
                </p>
                    {/* ================================
                        BANNER CAMPAIGN / SLIDER
                    ================================= */}
                    {campaigns.length === 1 ? (
                        <div
                            onClick={() => setSelectedCampaign(campaigns[0])}
                            className="block w-full overflow-hidden rounded-2xl shadow-xl hover:opacity-95 transition group cursor-pointer"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={`/storage/${campaigns[0].banner_path}`}
                                    alt={campaigns[0].title}
                                    className="w-full h-auto object-contain group-hover:scale-[1.01] transition duration-500"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="relative w-full overflow-hidden rounded-2xl shadow-xl group/main mb-16">
                            <div
                                className="flex transition-transform duration-700 ease-in-out"
                                style={{
                                    transform: `translateX(-${currentIndex * 100}%)`,
                                }}
                            >
                                {campaigns.map((campaign) => (
                                    <div
                                        key={campaign.id}
                                        onClick={() =>
                                            setSelectedCampaign(campaign)
                                        }
                                        className="w-full flex-shrink-0 block relative group overflow-hidden cursor-pointer"
                                    >
                                        <img
                                            src={`/storage/${campaign.banner_path}`}
                                            alt={campaign.title}
                                            className="w-full h-auto object-cover aspect-[21/9] sm:aspect-[3/1] group-hover:scale-105 transition duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-10">
                                            <div className="text-left">
                                                <h3 className="text-white font-semibold text-lg sm:text-2xl tracking-wide mb-1">
                                                    {campaign.title}
                                                </h3>
                                                {parseFloat(
                                                    campaign.discount_percent,
                                                ) > 0 && (
                                                    <span className="inline-block bg-gold text-ink text-xs px-2.5 py-0.5 rounded-full font-semibold animate-pulse">
                                                        Diskon{" "}
                                                        {parseFloat(
                                                            campaign.discount_percent,
                                                        )}
                                                        %
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide}
                                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover/main:opacity-100 transition-opacity duration-300 z-10"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover/main:opacity-100 transition-opacity duration-300 z-10"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>

                            {/* Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {campaigns.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentIndex(index);
                                        }}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            currentIndex === index
                                                ? "w-6 bg-gold"
                                                : "w-2 bg-white/60"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* MODAL CAMPAIGN DETAIL */}
                    {selectedCampaign && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
                            <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl transform transition-all relative">
                                <button
                                    onClick={() => setSelectedCampaign(null)}
                                    className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full z-10 transition"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <div className="relative">
                                    <img
                                        src={`/storage/${selectedCampaign.banner_path}`}
                                        alt={selectedCampaign.title}
                                        className="w-full h-48 sm:h-56 object-cover"
                                    />
                                    {parseFloat(selectedCampaign.discount_percent) > 0 && (
                                        <span className="absolute bottom-3 left-4 bg-gold text-ink text-xs px-3 py-1 rounded-full font-bold shadow">
                                            Hemat {parseFloat(selectedCampaign.discount_percent)}%
                                        </span>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-ink mb-2">
                                        {selectedCampaign.title}
                                    </h2>

                                    <div className="flex items-center gap-2 sm:gap-4 text-xs text-ink-soft mb-4 flex-wrap">
                                        <span className="bg-cream-deep px-2.5 py-1 rounded-md font-medium text-ink-soft flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5 text-ink-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatDate(selectedCampaign.start_date)} - {formatDate(selectedCampaign.end_date)}
                                        </span>
                                    </div>

                                    <p className="text-ink-soft text-sm leading-relaxed mb-6 max-h-36 overflow-y-auto">
                                        {selectedCampaign.description || "Tidak ada deskripsi untuk campaign ini."}
                                    </p>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setSelectedCampaign(null)}
                                            className="w-1/3 py-2.5 px-4 text-sm font-semibold text-ink-soft bg-cream-deep hover:bg-gold-line rounded-xl transition"
                                        >
                                            Tutup
                                        </button>
                                        <Link
                                            href={getCtaUrl(selectedCampaign)}
                                            className="w-2/3 py-2.5 px-4 text-sm font-semibold text-white bg-gold hover:bg-gold-ink text-center rounded-xl transition shadow-lg shadow-gold/30 flex items-center justify-center gap-2"
                                        >
                                            <span>Beli Sekarang</span>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </section>
    );
}

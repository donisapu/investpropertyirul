import { useState, useRef, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";

export default function Footer({
    settings,
    laravelVersion,
    phpVersion,
    partners,
    campaigns,
}) {
    const rowRef = useRef(null);
    const [canScroll, setCanScroll] = useState(false);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    console.log(settings);
    const checkScroll = () => {
        if (rowRef.current) {
            const el = rowRef.current;
            setCanScroll(el.scrollWidth > el.clientWidth);
            setAtStart(el.scrollLeft <= 0);
            setAtEnd(
                Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 1,
            );
        }
    };

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

    const scroll = (delta) => {
        if (rowRef.current) {
            rowRef.current.scrollBy({ left: delta, behavior: "smooth" });
        }
    };

    return (
        <footer className="bg-mono-900 text-mono-100">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
                {campaigns.length === 1 ? (
                    <div
                        onClick={() => setSelectedCampaign(campaigns[0])}
                        className="block w-full overflow-hidden rounded-2xl shadow-lg hover:opacity-95 transition group cursor-pointer"
                    >
                        <div className="relative overflow-hidden">
                            <img
                                src={`/storage/${campaigns[0].banner_path}`}
                                alt={campaigns[0].title}
                                className="w-full h-auto object-cover aspect-[21/9] sm:aspect-[3/1] group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                                <h3 className="text-white font-bold text-xl sm:text-2xl">
                                    {campaigns[0].title}
                                </h3>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* --- BANNER SLIDER --- */
                    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg group/main">
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
                                            <h3 className="text-white font-bold text-lg sm:text-2xl tracking-wide mb-1">
                                                {campaign.title}
                                            </h3>
                                            {parseFloat(
                                                campaign.discount_percent,
                                            ) > 0 && (
                                                <span className="inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded font-semibold animate-pulse">
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
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 19.5L8.25 12l7.5-7.5"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover/main:opacity-100 transition-opacity duration-300 z-10"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                />
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
                                            ? "w-6 bg-amber-400"
                                            : "w-2 bg-white/60"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {selectedCampaign && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                        <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl transform transition-all relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedCampaign(null)}
                                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full z-10 transition"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            {/* Modal Image Header */}
                            <div className="relative">
                                <img
                                    src={`/storage/${selectedCampaign.banner_path}`}
                                    alt={selectedCampaign.title}
                                    className="w-full h-48 sm:h-56 object-cover"
                                />
                                {parseFloat(selectedCampaign.discount_percent) >
                                    0 && (
                                    <span className="absolute bottom-3 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow">
                                        Hemat{" "}
                                        {parseFloat(
                                            selectedCampaign.discount_percent,
                                        )}
                                        %
                                    </span>
                                )}
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">
                                    {selectedCampaign.title}
                                </h2>

                                {/* Info Periode & Status */}
                                <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500 mb-4 flex-wrap">
                                    <span className="bg-gray-100 px-2.5 py-1 rounded-md font-medium text-gray-700 flex items-center gap-1.5">
                                        <svg
                                            className="w-3.5 h-3.5 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        {formatDate(
                                            selectedCampaign.start_date,
                                        )}{" "}
                                        -{" "}
                                        {formatDate(selectedCampaign.end_date)}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm leading-relaxed mb-6 max-h-36 overflow-y-auto">
                                    {selectedCampaign.description ||
                                        "Tidak ada deskripsi untuk campaign ini."}
                                </p>

                                {/* CTA Transaksi / Detail Page */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() =>
                                            setSelectedCampaign(null)
                                        }
                                        className="w-1/3 py-2.5 px-4 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                                    >
                                        Tutup
                                    </button>
                                    <Link
                                        href={getCtaUrl(selectedCampaign)}
                                        className="w-2/3 py-2.5 px-4 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 text-center rounded-xl transition shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
                                    >
                                        <span>Beli Sekarang</span>
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-center">
                    <div className="flex gap-2 items-center justify-center">
                        <span className="inline-block text-mono-500 text-2xl sm:text-3xl font-semibold tracking-wide">
                            Partner
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-semibold">
                            Kami
                        </h2>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-mono-100">
                        Kami memiliki beberapa partner yang membantu kami dalam
                        membangun rumah untuk klien-klien kami.
                    </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-12">
                    {partners.map((partner) => (
                        <div key={partner.id} className="flex-shrink-0">
                            <img
                                src={`/storage/${partner.image_url}`}
                                alt={partner.name}
                                className="h-16 object-contain opacity-100 hover:opacity-70 hover:grayscale-0 transition duration-300"
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-10 grid gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="text-mono-100 font-semibold">
                            Tentang Kami
                        </h3>
                        <p className="mt-2 text-sm text-mono-300">
                            {settings?.description}
                        </p>
                        <div className="mt-2 text-sm text-mono-300">
                            <span className="mr-2">📍</span> {settings?.address}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-mono-100 font-semibold">Beranda</h3>
                        <ul className="mt-2 space-y-1 text-sm">
                            <li>
                                <a
                                    href="/investments"
                                    className="text-mono-100 hover:text-mono-300"
                                >
                                    Investment
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/crowdfunding"
                                    className="text-mono-100 hover:text-mono-300"
                                >
                                    Crowdfunding
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/property-for-sale"
                                    className="text-mono-100 hover:text-mono-300"
                                >
                                    Property for Sale
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/how-to-invest"
                                    className="text-mono-100 hover:text-mono-300"
                                >
                                    How to Invest
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold">
                            Hubungi Kami
                        </h3>
                        <ul className="mt-2 space-y-1 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="text-slate-500">📞</span>
                                <a
                                    href={`https://wa.me/${settings?.whatsapp}`}
                                    className="text-mono-100 hover:text-mono-300"
                                >
                                    +{settings?.whatsapp}
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-slate-500">✉️</span>
                                <a
                                    href={`mailto:${settings?.email}`}
                                    className="text-mono-100 hover:text-mono-300"
                                >
                                    {settings?.email}
                                </a>
                            </li>
                        </ul>
                        <div className="mt-4 flex items-center gap-3">
                            <a
                                href={settings?.facebook_url || "#"}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-mono-700 text-mono-100 hover:bg-mono-100 hover:text-mono-900 transition"
                                aria-label="Facebook"
                            >
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.3 3h-1.9v7A10 10 0 0022 12z" />
                                </svg>
                            </a>
                            <a
                                href={settings?.instagram_url || "#"}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-mono-700 text-mono-100 hover:bg-mono-100 hover:text-mono-900 transition"
                                aria-label="Instagram"
                            >
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm6-1a1 1 0 100 2 1 1 0 000-2z" />
                                </svg>
                            </a>
                            <a
                                href={settings?.youtube_url || "#"}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-mono-700 text-mono-100 hover:bg-mono-100 hover:text-mono-900 transition"
                                aria-label="YouTube"
                            >
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.8 3.6 12 3.6 12 3.6s-7.8 0-9.4.5A3 3 0 00.6 6.2 31.6 31.6 0 000 12a31.6 31.6 0 00.6 5.8 3 3 0 002.1 2.1c1.6.5 9.4.5 9.4.5s7.8 0 9.4-.5a3 3 0 002.1-2.1c.4-1.9.6-3.8.6-5.8s-.2-3.9-.6-5.8zM9.7 15.5V8.5l6.2 3.5-6.2 3.5z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-600">
                    <p className="text-[0.8rem]">
                        © {new Date().getFullYear()} {settings?.site_name}. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

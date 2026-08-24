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

    if (!campaigns) return null;

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
                                className="w-full h-auto object-contain group-hover:scale-[1.01] transition duration-500"
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

                {/* ================================
                    PARTNER / TRUSTED PARTNERS
                ================================= */}
                <div className="border-b border-white/10 py-16">

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

                        <div className="max-w-xl">
                            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                                Trusted Partners
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.04em]">
                                Dibangun bersama
                                <br />
                                partner terpercaya.
                            </h2>
                        </div>

                        <p className="max-w-md text-sm leading-7 text-white/50">
                            Kami bekerja sama dengan berbagai partner untuk
                            menghadirkan pengalaman properti yang lebih baik
                            bagi para klien dan investor.
                        </p>

                    </div>

                    <div className="mt-12 flex flex-wrap items-center gap-x-12 gap-y-8">
                        {partners?.map((partner) => (
                            <div
                                key={partner.id}
                                className="group flex h-14 items-center"
                            >
                                <img
                                    src={`/storage/${partner.image_url}`}
                                    alt={partner.name}
                                    className="max-h-12 w-auto max-w-[150px] object-contain grayscale opacity-50 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                                />
                            </div>
                        ))}
                    </div>

                </div>


                {/* ================================
                    MAIN FOOTER
                ================================= */}
                <div className="grid grid-cols-1 gap-14 py-16 md:grid-cols-2 lg:grid-cols-12">

                    {/* BRAND */}
                    <div className="lg:col-span-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-sm font-semibold">
                               <img
                                src={
                                    settings?.logo
                                        ? settings.logo.startsWith("http") ||
                                          settings.logo.startsWith("/")
                                            ? settings.logo
                                            : `/storage/${settings.logo}`
                                        : "/assets/img/logo.png"
                                }
                                alt="logo"
                                className="h-10 w-auto sm:h-12 lg:h-14 object-contain max-w-[150px] sm:max-w-[200px]"
                            />
                            </div>

                            <div>
                                <div className="text-lg font-bold tracking-[-0.04em]">
                                    GAIN
                                </div>

                                <div className="text-[9px] font-medium tracking-[0.25em] text-white/40">
                                    PROPERTIES
                                </div>
                            </div>

                        </div>

                        <p className="mt-7 max-w-md text-sm leading-7 text-white/45">
                            {settings?.description}
                        </p>

                        {settings?.address && (
                            <div className="mt-6 flex gap-3 text-sm text-white/50">
                                <span className="text-white/70">+</span>
                                <span>{settings?.address}</span>
                            </div>
                        )}

                    </div>


                    {/* EXPLORE */}
                    <div className="lg:col-span-2">

                        <h3 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                            Explore
                        </h3>

                        <div className="flex flex-col gap-3">

                            <a
                                href="/investments"
                                className="text-sm text-white/60 transition hover:text-white"
                            >
                                Investment
                            </a>

                            <a
                                href="/crowdfunding"
                                className="text-sm text-white/60 transition hover:text-white"
                            >
                                Crowdfunding
                            </a>

                            <a
                                href="/property-for-sale"
                                className="text-sm text-white/60 transition hover:text-white"
                            >
                                Property for Sale
                            </a>

                            <a
                                href="/how-to-invest"
                                className="text-sm text-white/60 transition hover:text-white"
                            >
                                How to Invest
                            </a>

                        </div>

                    </div>


                    {/* COMPANY */}
                    {/* <div className="lg:col-span-2">

                        <h3 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                            Company
                        </h3>

                        <div className="flex flex-col gap-3">

                            <a
                                href="/about"
                                className="text-sm text-white/60 transition hover:text-white"
                            >
                                Tentang Kami
                            </a>

                            <a
                                href="/partner"
                                className="text-sm text-white/60 transition hover:text-white"
                            >
                                Partner
                            </a>

                            <a
                                href="/faq"
                                className="text-sm text-white/60 transition hover:text-white"
                            >
                                FAQ
                            </a>

                            <a
                                href="/contact"
                                className="text-sm text-white/60 transition hover:text-white"
                            >
                                Kontak
                            </a>

                        </div>

                    </div> */}


                    {/* CONTACT */}
                    <div className="lg:col-span-3">

                        <h3 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                            Get in touch
                        </h3>

                        <div className="space-y-4">

                            {settings?.whatsapp && (
                                <a
                                    href={`https://wa.me/${settings.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-sm text-white/60 transition hover:text-white"
                                >
                                    +{settings.whatsapp}
                                </a>
                            )}

                            {settings?.email && (
                                <a
                                    href={`mailto:${settings.email}`}
                                    className="block break-all text-sm text-white/60 transition hover:text-white"
                                >
                                    {settings.email}
                                </a>
                            )}

                        </div>


                        {/* SOCIAL */}
                        <div className="mt-7 flex gap-2">

                            {settings?.facebook_url && (
                                <a
                                    href={settings.facebook_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xs text-white/50 transition hover:border-white/40 hover:text-white"
                                >
                                    f
                                </a>
                            )}

                            {settings?.instagram_url && (
                                <a
                                    href={settings.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xs text-white/50 transition hover:border-white/40 hover:text-white"
                                >
                                    ◎
                                </a>
                            )}

                            {settings?.youtube_url && (
                                <a
                                    href={settings.youtube_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xs text-white/50 transition hover:border-white/40 hover:text-white"
                                >
                                    ▶
                                </a>
                            )}

                        </div>

                    </div>

                </div>


                {/* ================================
                    BOTTOM COPYRIGHT
                ================================= */}
                <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-[11px] text-white/30 sm:flex-row sm:items-center sm:justify-between">

                    <p>
                        © {new Date().getFullYear()} {settings?.site_name}.
                        All rights reserved.
                    </p>

                    {/* <div className="flex gap-6">

                        <a
                            href="/privacy-policy"
                            className="transition hover:text-white/70"
                        >
                            Privacy Policy
                        </a>

                        <a
                            href="/terms"
                            className="transition hover:text-white/70"
                        >
                            Terms &amp; Conditions
                        </a>

                    </div> */}

                </div>
            </div>
        </footer>
    );
}

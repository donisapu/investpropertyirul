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
                            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C8A45D]/80">
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
                    <div className="lg:col-span-2">

                        <h3 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                            Membership
                        </h3>

                        <div className="flex flex-col gap-3">

                            <a
                                href="https://gainproperties.id/login"
                                className="text-sm text-white/60 transition hover:text-white"
                            >
                                Member Login
                            </a>

                            <a
                                href="https://gainproperties.id/register"
                                className="text-sm text-white/60 transition hover:text-white"
                            >
                                Member Register
                            </a>

                        </div>

                    </div>


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
                                className="
                                    group flex items-center gap-3
                                    text-sm text-white/60
                                    transition-all duration-300
                                    hover:text-white
                                "
                            >
                                {/* WhatsApp Icon */}
                                <span
                                    className="
                                        flex h-10 w-10 shrink-0 items-center justify-center
                                        rounded-full
                                        border border-white/10
                                        bg-white/[0.03]
                                        text-white/60
                                        transition-all duration-300
                                        group-hover:-translate-y-0.5
                                        group-hover:border-white/30
                                        group-hover:bg-white/[0.08]
                                        group-hover:text-white
                                    "
                                >
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M20.52 3.48A11.82 11.82 0 0012.06 0C5.53 0 .22 5.31.22 11.84c0 2.09.55 4.13 1.59 5.93L.11 24l6.37-1.67a11.83 11.83 0 005.58 1.42h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.16-1.23-6.13-3.39-8.43zM12.07 21.7h-.01a9.84 9.84 0 01-5.02-1.37l-.36-.21-3.78.99 1.01-3.68-.23-.38a9.84 9.84 0 01-1.51-5.21C2.17 6.4 6.6 1.97 12.07 1.97c2.65 0 5.14 1.03 7.01 2.9a9.85 9.85 0 012.91 7.02c0 5.47-4.45 9.81-9.92 9.81zm5.39-7.35c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35z" />
                                    </svg>
                                </span>

                                <span className="truncate">
                                    +{settings.whatsapp}
                                </span>
                            </a>
                        )}

                        {settings?.email && (
                            <a
                                href={`mailto:${settings.email}`}
                                className="
                                    group flex items-center gap-3
                                    text-sm text-white/60
                                    transition-all duration-300
                                    hover:text-white
                                "
                            >
                                {/* Email Icon */}
                                <span
                                    className="
                                        flex h-10 w-10 shrink-0 items-center justify-center
                                        rounded-full
                                        border border-white/10
                                        bg-white/[0.03]
                                        text-white/60
                                        transition-all duration-300
                                        group-hover:-translate-y-0.5
                                        group-hover:border-white/30
                                        group-hover:bg-white/[0.08]
                                        group-hover:text-white
                                    "
                                >
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            x="3"
                                            y="5"
                                            width="18"
                                            height="14"
                                            rx="2"
                                        />
                                        <path d="M3 7l9 6 9-6" />
                                    </svg>
                                </span>

                                <span className="break-all">
                                    {settings.email}
                                </span>
                            </a>
                        )}

                    </div>


                    {/* SOCIAL */}
                    <div className="mt-7 flex items-center gap-3">

                        {settings?.facebook_url && (
                            <a
                                href={settings.facebook_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="
                                    flex h-11 w-11 items-center justify-center
                                    rounded-full
                                    border border-white/15
                                    bg-white/[0.03]
                                    text-white/60
                                    shadow-sm
                                    transition-all duration-300
                                    hover:-translate-y-1
                                    hover:border-white/40
                                    hover:bg-white/[0.08]
                                    hover:text-white
                                    hover:shadow-lg
                                "
                            >
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.3 3h-1.9v7A10 10 0 0022 12z" />
                                </svg>
                            </a>
                        )}

                        {settings?.instagram_url && (
                            <a
                                href={settings.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="
                                    flex h-11 w-11 items-center justify-center
                                    rounded-full
                                    border border-white/15
                                    bg-white/[0.03]
                                    text-white/60
                                    shadow-sm
                                    transition-all duration-300
                                    hover:-translate-y-1
                                    hover:border-white/40
                                    hover:bg-white/[0.08]
                                    hover:text-white
                                    hover:shadow-lg
                                "
                            >
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm6-1a1 1 0 100 2 1 1 0 000-2z" />
                                </svg>
                            </a>
                        )}

                        {settings?.youtube_url && (
                            <a
                                href={settings.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                                className="
                                    flex h-11 w-11 items-center justify-center
                                    rounded-full
                                    border border-white/15
                                    bg-white/[0.03]
                                    text-white/60
                                    shadow-sm
                                    transition-all duration-300
                                    hover:-translate-y-1
                                    hover:border-white/40
                                    hover:bg-white/[0.08]
                                    hover:text-white
                                    hover:shadow-lg
                                "
                            >
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.8 3.6 12 3.6 12 3.6s-7.8 0-9.4.5A3 3 0 00.6 6.2 31.6 31.6 0 000 12a31.6 31.6 0 00.6 5.8 3 3 0 002.1 2.1c1.6.5 9.4.5 9.4.5s7.8 0 9.4-.5a3 3 0 002.1-2.1c.4-1.9.6-3.8.6-5.8s-.2-3.9-.6-5.8zM9.7 15.5V8.5l6.2 3.5-6.2 3.5z" />
                                </svg>
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

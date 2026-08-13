import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { FacebookIcon, Instagram, Youtube } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function PublicLayout({ children }) {
    const { auth, settings, partners, campaigns } = usePage().props;
    const { url } = usePage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [accountOpen, setAccountOpen] = useState(false);
    // Helper to check active route
    const isActive = (path) =>
        url === path || (path !== "/" && url.startsWith(path));

    // Determine if we are on the home page
    const isHome = window.location.pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            if (isHome) {
                setIsScrolled(window.scrollY > 40);
            } else {
                setIsScrolled(true);
            }
        };

        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setAccountOpen(false);
            }
        };

        // Initial check
        handleScroll();

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHome]);

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
            {/* Header */}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#334155",
                        color: "#fff",
                        borderRadius: "0.5rem",
                    },
                    success: {
                        style: { background: "#059669", color: "white" },
                    },
                    error: {
                        style: { background: "#e11d48", color: "white" },
                    },
                }}
            />
            <header
                className={`sticky top-0 z-50 transition-colors duration-300 ${
                    isScrolled || isMobileMenuOpen
                        ? "bg-white border-b border-slate-200 shadow-sm"
                        : "bg-slate-700/15 border-b border-transparent"
                }`}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <a href="/" className="flex items-center gap-3">
                                <img
                                    src={
                                        settings?.logo
                                            ? settings.logo.startsWith(
                                                  "http",
                                              ) || settings.logo.startsWith("/")
                                                ? settings.logo
                                                : `/storage/${settings.logo}`
                                            : "/assets/img/logo.png"
                                    }
                                    alt="logo"
                                    className="h-10 w-auto sm:h-12 lg:h-14 object-contain max-w-[150px] sm:max-w-[200px]"
                                />
                                {/* Tambahkan Site Name di sini */}
                                <span
                                    className={`text-lg font-bold uppercase tracking-wider ${isScrolled || isMobileMenuOpen ? "text-slate-900" : "text-white"}`}
                                >
                                    {settings?.site_name || "Gain Properties"}
                                </span>
                            </a>
                        </div>

                        {/* Desktop Menu */}
                        <nav
                            className={`hidden min-[900px]:flex items-center gap-2 xl:gap-3 text-[0.7rem] xl:text-sm font-medium uppercase tracking-wide ${
                                isScrolled || isMobileMenuOpen
                                    ? "text-slate-900"
                                    : "text-white"
                            }`}
                        >
                            <a
                                href="/"
                                className={`${isActive("/") ? "text-emerald-700 font-bold" : "hover:text-emerald-600"} transition-colors`}
                            >
                                HOME
                            </a>
                            <span className="text-slate-300">|</span>
                            <Link
                                href="/investments"
                                className={`${isActive("/investments") ? "text-emerald-700 font-bold" : "hover:text-emerald-600"} transition-colors`}
                            >
                                INVESTMENT
                            </Link>
                            {/* <span className="text-slate-300">|</span>
                            <Link
                                href="/crowdfunding"
                                className={`${isActive("/crowdfunding") ? "text-emerald-700 font-bold" : "hover:text-emerald-600"} transition-colors`}
                            >
                                CROWDFUNDING
                            </Link>
                            <span className="text-slate-300">|</span>
                            <Link
                                href="/property-for-sale"
                                className={`${isActive("/property-for-sale") ? "text-emerald-700 font-bold" : "hover:text-emerald-600"} transition-colors`}
                            >
                                PROPERTY FOR SALE
                            </Link> */}
                            <span className="text-slate-300">|</span>
                            <Link
                                href="/how-to-invest"
                                className={`${isActive("/how-to-invest") ? "text-emerald-700 font-bold" : "hover:text-emerald-600"} transition-colors`}
                            >
                                HOW TO INVEST
                            </Link>
                            <span className="text-slate-300">|</span>

                            {auth.user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() =>
                                            setAccountOpen(!accountOpen)
                                        }
                                        className="flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-600 transition-colors focus:outline-none uppercase"
                                    >
                                        MY ACCOUNT
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>

                                    {accountOpen && (
                                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 normal-case">
                                            <a
                                                href={route("user.dashboard")}
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                                            >
                                                Dashboard
                                            </a>
                                            <a
                                                href={route("user.portfolio")}
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                                            >
                                                My Portfolio
                                            </a>
                                            <a
                                                href={route("user.portfolio")}
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                                            >
                                                My Bids
                                            </a>
                                            <a
                                                href={route("user.portfolio")}
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                                            >
                                                Transactions
                                            </a>
                                            <a
                                                href={route("user.portfolio")}
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                                            >
                                                Account Setting
                                            </a>
                                            <div className="border-t border-slate-100 mt-1">
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    LOGOUT
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <a
                                    href={route("login")}
                                    className="hover:text-emerald-600 transition-colors font-bold text-emerald-400"
                                >
                                    MY ACCOUNT
                                </a>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="flex min-[900px]:hidden">
                            <button
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                type="button"
                                className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isMobileMenuOpen ? (
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div
                        className="min-[900px]:hidden bg-white border-t border-slate-200 relative z-50"
                        id="mobile-menu"
                    >
                        <div className="space-y-1 px-4 py-6">
                            {/* Navigasi Utama */}
                            <Link
                                href="/"
                                className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600"
                            >
                                HOME
                            </Link>
                            <Link
                                href={route("investments.index")}
                                className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600"
                            >
                                INVESTMENT
                            </Link>
                            {/* <Link
                                href={route("crowdfunding.index")}
                                className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600"
                            >
                                CROWDFUNDING
                            </Link>
                            <Link
                                href="#property"
                                className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600"
                            >
                                PROPERTY FOR SALE
                            </Link> */}
                            <Link
                                href="/how-to-invest"
                                className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600"
                            >
                                HOW TO INVEST
                            </Link>

                            {/* Account */}
                            <div
                                className="mt-4 border-t border-slate-100 pt-4"
                                ref={dropdownRef}
                            >
                                {auth.user ? (
                                    <div className="flex flex-col">
                                        {/* Trigger */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setAccountOpen(!accountOpen);
                                            }}
                                            className="flex items-center justify-between w-full rounded-md py-2 px-3 text-base font-bold text-emerald-700 hover:bg-emerald-50 uppercase"
                                        >
                                            <span>MY ACCOUNT</span>
                                        </button>

                                        {/* Dropdown */}
                                        {accountOpen && (
                                            <div className="ml-4 mt-1 space-y-1 normal-case relative z-[999]">
                                                <a
                                                    href={route(
                                                        "user.dashboard",
                                                    )}
                                                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                                                >
                                                    Dashboard
                                                </a>
                                                <a
                                                    href={route(
                                                        "user.portfolio",
                                                    )}
                                                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                                                >
                                                    My Portfolio
                                                </a>
                                                <a
                                                    href={route(
                                                        "user.portfolio",
                                                    )}
                                                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                                                >
                                                    My Bids
                                                </a>
                                                <a
                                                    href={route(
                                                        "user.portfolio",
                                                    )}
                                                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                                                >
                                                    Transactions
                                                </a>
                                                <a
                                                    href={route(
                                                        "user.portfolio",
                                                    )}
                                                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                                                >
                                                    Account Setting
                                                </a>

                                                <div className="border-t border-slate-100 mt-2 pt-1">
                                                    <Link
                                                        href={route("logout")}
                                                        method="post"
                                                        as="button"
                                                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        Logout
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <a
                                        href={route("login")}
                                        className="hover:text-emerald-600 px-3 py-2 transition-colors font-bold text-emerald-400"
                                    >
                                        MY ACCOUNT
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

function Footer() {
    const { settings, partners, campaigns } = usePage().props;
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(
                Math.ceil(scrollLeft + clientWidth) < scrollWidth,
            );
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        const el = scrollRef.current;
        if (el) el.addEventListener("scroll", checkScroll);

        return () => {
            window.removeEventListener("resize", checkScroll);
            if (el) el.removeEventListener("scroll", checkScroll);
        };
    }, []);

    const scroll = (offset) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
        }
    };

    return (
        <footer className="bg-mono-900 text-mono-100">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
                {campaigns && campaigns.length > 0 && (
                    <div className="mb-16 w-full max-w-5xl mx-auto px-4">
                        {campaigns.length === 1 ? (
                            // JIKA CUMA 1: Dibungkus Link
                            <Link
                                href={`/campaigns/${campaigns[0].id}`}
                                className="block w-full overflow-hidden rounded-2xl shadow-lg hover:opacity-95 transition group"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={`/storage/${campaigns[0].banner_path}`}
                                        alt={campaigns[0].title}
                                        className="w-full h-auto object-cover aspect-[21/9] sm:aspect-[3/1] group-hover:scale-105 transition duration-500"
                                    />
                                    {/* Overlay Title Singkat ala Crowdfunding */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                                        <h3 className="text-white font-bold text-xl sm:text-2xl">
                                            {campaigns[0].title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            // JIKA LEBIH DARI 1: Carousel Aktif dengan Link di tiap gambar
                            (() => {
                                const [currentIndex, setCurrentIndex] =
                                    useState(0);

                                useEffect(() => {
                                    const timer = setInterval(() => {
                                        setCurrentIndex((prevIndex) =>
                                            prevIndex === campaigns.length - 1
                                                ? 0
                                                : prevIndex + 1,
                                        );
                                    }, 5000);
                                    return () => clearInterval(timer);
                                }, [currentIndex]);

                                const prevSlide = () => {
                                    setCurrentIndex((prev) =>
                                        prev === 0
                                            ? campaigns.length - 1
                                            : prev - 1,
                                    );
                                };

                                const nextSlide = () => {
                                    setCurrentIndex((prev) =>
                                        prev === campaigns.length - 1
                                            ? 0
                                            : prev + 1,
                                    );
                                };

                                return (
                                    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg group/main">
                                        {/* Wrapper Gambar */}
                                        <div
                                            className="flex transition-transform duration-700 ease-in-out"
                                            style={{
                                                transform: `translateX(-${currentIndex * 100}%)`,
                                            }}
                                        >
                                            {campaigns.map((campaign) => (
                                                <Link
                                                    key={campaign.id}
                                                    href={`/campaigns/${campaign.id}`}
                                                    className="w-full flex-shrink-0 block relative group overflow-hidden"
                                                >
                                                    <img
                                                        src={`/storage/${campaign.banner_path}`}
                                                        alt={campaign.title}
                                                        className="w-full h-auto object-cover aspect-[21/9] sm:aspect-[3/1] group-hover:scale-105 transition duration-500"
                                                    />
                                                    {/* Gradient Overlay biar title keliatan jelas */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-10">
                                                        <div className="text-left">
                                                            <h3 className="text-white font-bold text-lg sm:text-2xl tracking-wide mb-1">
                                                                {campaign.title}
                                                            </h3>
                                                            {/* Skenario diskon investasi (jika ada) */}
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
                                                </Link>
                                            ))}
                                        </div>

                                        {/* Tombol Arrow Kiri */}
                                        <button
                                            onClick={prevSlide}
                                            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover/main:opacity-100 transition-opacity duration-300 z-10"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15.75 19.5L8.25 12l7.5-7.5"
                                                />
                                            </svg>
                                        </button>

                                        {/* Tombol Arrow Kanan */}
                                        <button
                                            onClick={nextSlide}
                                            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover/main:opacity-100 transition-opacity duration-300 z-10"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                                />
                                            </svg>
                                        </button>

                                        {/* Indikator Titik (Dots) */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                            {campaigns.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        setCurrentIndex(index)
                                                    }
                                                    className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index ? "w-6 bg-amber-400" : "w-2 bg-white/60"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()
                        )}
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
                            {/* <li>
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
                            </li> */}
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

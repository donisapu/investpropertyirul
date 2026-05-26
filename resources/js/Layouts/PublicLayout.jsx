import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { FacebookIcon, Instagram, Youtube } from "lucide-react";

export default function PublicLayout({ children }) {
    const { auth, settings } = usePage().props;
    const { url } = usePage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [accountOpen, setAccountOpen] = useState(false);
    console.log(settings);
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
                        <div className="flex-shrink-0 flex items-center">
                            <a href="/">
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
                            <span className="text-slate-300">|</span>
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
                            </Link>
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
                            <Link
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
                            </Link>
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
    const { settings } = usePage().props;
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
        <footer className="bg-white text-slate-900">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <div className="flex gap-2 items-center justify-center">
                        <span className="inline-block rounded-lg bg-amber-200 px-2 py-1 text-amber-900 text-2xl sm:text-3xl font-semibold tracking-wide">
                            Partner
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-semibold">
                            Kami
                        </h2>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                        Kami memiliki beberapa partner yang membantu kami dalam
                        membangun rumah untuk klien-klien kami.
                    </p>
                </div>

                <div className="mt-6 relative group">
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll(-300)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow border border-slate-200 text-slate-700 hover:bg-slate-50 z-10 flex items-center justify-center"
                        >
                            ‹
                        </button>
                    )}

                    <div
                        ref={scrollRef}
                        className="overflow-x-auto flex items-center justify-center whitespace-nowrap scrollbar-hide px-10 no-scrollbar"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        <div className="inline-flex items-center gap-8">
                            <img
                                src="https://dummyimage.com/120x40/eaecf0/111&text=Mandiri"
                                alt="Mandiri"
                                className="h-10 object-contain"
                            />
                            <img
                                src="https://dummyimage.com/120x40/eaecf0/111&text=BRI"
                                alt="BRI"
                                className="h-10 object-contain"
                            />
                            <img
                                src="https://dummyimage.com/120x40/eaecf0/111&text=BNI"
                                alt="BNI"
                                className="h-10 object-contain"
                            />
                            <img
                                src="https://dummyimage.com/120x40/eaecf0/111&text=Bule"
                                alt="Bule"
                                className="h-10 object-contain"
                            />
                            <img
                                src="https://dummyimage.com/120x40/eaecf0/111&text=X+I+BOBA"
                                alt="X I BOBA"
                                className="h-10 object-contain"
                            />
                            <img
                                src="https://dummyimage.com/120x40/eaecf0/111&text=Partner"
                                alt="Partner"
                                className="h-10 object-contain"
                            />
                        </div>
                    </div>

                    {canScrollRight && (
                        <button
                            onClick={() => scroll(300)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow border border-slate-200 text-slate-700 hover:bg-slate-50 z-10 flex items-center justify-center"
                        >
                            ›
                        </button>
                    )}
                </div>

                <div className="mt-10 grid gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="text-base font-semibold">
                            Tentang Kami
                        </h3>
                        <p className="mt-2 text-sm text-slate-700">
                            PT. Umah Bali Mesari adalah perusahaan yang bergerak
                            di bidang Developer dan Kontraktor yang berbasis di
                            Bali dengan visi dan misi serta jangkauan layanan
                            yang menyeluruh yang dipersembahkan untuk kepuasan
                            konsumen.
                        </p>
                        <div className="mt-2 text-sm text-slate-700">
                            <span className="mr-2">📍</span> Jalan Raya
                            Singaraja – Seririt, Desa Penarom, Buleleng, Bali
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold">Beranda</h3>
                        <ul className="mt-2 space-y-1 text-sm">
                            <li>
                                <a
                                    href="/investments"
                                    className="hover:text-emerald-600"
                                >
                                    Investment
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/crowdfunding"
                                    className="hover:text-emerald-600"
                                >
                                    Crowdfunding
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/property-for-sale"
                                    className="hover:text-emerald-600"
                                >
                                    Property for Sale
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/how-to-invest"
                                    className="hover:text-emerald-600"
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
                                    href={`tel:+${settings?.whatsapp}`}
                                    className="hover:text-emerald-600"
                                >
                                    +{settings?.whatsapp}
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-slate-500">✉️</span>
                                <a
                                    href="mailto:umahbalimesari@gmail.com"
                                    className="hover:text-emerald-600"
                                >
                                    umahbalimesari@gmail.com
                                </a>
                            </li>
                        </ul>
                        <div className="mt-4 flex items-center gap-3">
                            <a
                                href={settings?.facebook_url || "#"}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-emerald-600 transition-colors"
                                aria-label="Facebook"
                            >
                                <FacebookIcon className="h-4 w-4" />
                            </a>
                            <a
                                href={settings?.instagram_url || "#"}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-emerald-600 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href={settings?.youtube_url || "#"}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-emerald-600 transition-colors"
                                aria-label="YouTube"
                            >
                                <Youtube className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-600">
                    <p className="text-[0.8rem]">
                        © {new Date().getFullYear()}{" "}
                        {settings?.site_name || "Umah Bali Mesari"}. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

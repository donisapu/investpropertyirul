import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { route } from "ziggy-js";
import { ChevronDown, Menu, X } from "lucide-react";

/*
 * Header — mengikuti mockup Figma (export Pencil).
 *
 * Mockup memakai satu bar terang: brand kiri, navigasi tengah, dan
 * "My Account" sebagai pill gelap di kanan. Tidak ada lagi pergantian
 * ground saat scroll, dan pemisah "|" antar menu dihapus.
 *
 * Menu didefinisikan sekali di NAV_LINKS / ACCOUNT_LINKS lalu dipakai
 * ulang untuk desktop dan drawer mobile. Sebelumnya kedua tampilan itu
 * ditulis terpisah sehingga setiap penambahan menu harus diedit dua kali.
 */

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Investment", routeName: "investments.index" },
    { label: "Crowdfunding", routeName: "crowdfunding.index" },
    { label: "Property for Sale", routeName: "property-for-sale.index" },
    { label: "How to Invest", href: "/how-to-invest" },
];

const ACCOUNT_LINKS = [
    { label: "Dashboard", routeName: "user.dashboard" },
    { label: "My Portfolio", routeName: "user.portfolio" },
    { label: "My Bids", routeName: "user.bid" },
    { label: "Transactions", routeName: "user.transaction" },
    { label: "Account Setting", routeName: "user.profile" },
];

/* Ziggy melempar bila nama route belum terdaftar; jatuh ke "#" agar
 * header tidak ikut menjatuhkan seluruh halaman. */
function safeRoute(name, fallback = "#") {
    try {
        return route(name);
    } catch {
        return fallback;
    }
}

function hrefOf(item) {
    return item.href ?? safeRoute(item.routeName);
}

export default function Header() {
    const { auth, settings, url } = usePage().props;
    const currentPath = usePage().url ?? url ?? "/";

    const [open, setOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setAccountOpen(false);
            }
        };
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setAccountOpen(false);
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const logoSrc = settings?.logo
        ? settings.logo.startsWith("http") || settings.logo.startsWith("/")
            ? settings.logo
            : `/storage/${settings.logo}`
        : null;

    const siteName = settings?.site_name || "Gain Properties";

    const isActive = (item) => {
        const href = item.href ?? "";
        if (href === "/") return currentPath === "/";
        const target = hrefOf(item);
        return target !== "#" && currentPath.startsWith(new URL(target, "http://x").pathname);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gold-line bg-cream">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-[72px] lg:py-[25px]">
                {/* ================= BRAND ================= */}
                <Link href="/" className="flex shrink-0 items-center gap-2.5">
                    {logoSrc && (
                        <img
                            src={logoSrc}
                            alt=""
                            className="h-[42px] w-[42px] shrink-0 object-contain"
                        />
                    )}
                    <span className="text-[16px] font-extrabold uppercase leading-6 tracking-[1.3px] text-ink">
                        {siteName}
                    </span>
                </Link>

                {/* ================= NAVIGASI DESKTOP ================= */}
                <nav
                    aria-label="Navigasi utama"
                    className="hidden items-center gap-[22px] lg:flex"
                >
                    {NAV_LINKS.map((item) => (
                        <Link
                            key={item.label}
                            href={hrefOf(item)}
                            aria-current={isActive(item) ? "page" : undefined}
                            className={`text-[12px] font-semibold leading-[18px] transition-colors hover:text-gold-ink ${
                                isActive(item) ? "text-gold-ink" : "text-ink"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* ================= AKUN (DESKTOP) ================= */}
                <div className="hidden shrink-0 items-center lg:flex">
                    {auth?.user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setAccountOpen(!accountOpen)}
                                aria-expanded={accountOpen}
                                aria-haspopup="menu"
                                className="flex items-center gap-2 rounded-[40px] bg-ink px-[23px] py-4 text-[13px] font-semibold leading-5 text-cream transition-colors hover:bg-ink-soft"
                            >
                                My Account
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform duration-200 ${
                                        accountOpen ? "rotate-180" : ""
                                    }`}
                                    aria-hidden="true"
                                />
                            </button>

                            {accountOpen && (
                                <div
                                    role="menu"
                                    className="absolute right-0 z-50 mt-3 w-52 overflow-hidden rounded-2xl border border-gold-line bg-white py-2 shadow-xl"
                                >
                                    {ACCOUNT_LINKS.map((item) => (
                                        <a
                                            key={item.label}
                                            role="menuitem"
                                            href={hrefOf(item)}
                                            className="block px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-cream-deep hover:text-ink"
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                    <div className="my-1 h-px bg-gold-line" />
                                    <Link
                                        role="menuitem"
                                        href={safeRoute("logout")}
                                        method="post"
                                        as="button"
                                        className="block w-full px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href={safeRoute("login")}
                            className="rounded-[40px] bg-ink px-[23px] py-4 text-[13px] font-semibold leading-5 text-cream transition-colors hover:bg-ink-soft"
                        >
                            My Account
                        </Link>
                    )}
                </div>

                {/* ================= TOMBOL MENU MOBILE ================= */}
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    aria-controls="menu-mobile"
                    className="inline-flex items-center justify-center rounded-full p-2 text-ink transition-colors hover:bg-cream-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink lg:hidden"
                >
                    <span className="sr-only">
                        {open ? "Tutup menu" : "Buka menu"}
                    </span>
                    {open ? (
                        <X className="h-6 w-6" aria-hidden="true" />
                    ) : (
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    )}
                </button>
            </div>

            {/* ================= DRAWER MOBILE ================= */}
            {open && (
                <div
                    id="menu-mobile"
                    className="border-t border-gold-line bg-cream px-6 pb-6 pt-2 sm:px-10 lg:hidden"
                >
                    <nav aria-label="Navigasi utama (mobile)" className="flex flex-col">
                        {NAV_LINKS.map((item) => (
                            <Link
                                key={item.label}
                                href={hrefOf(item)}
                                onClick={() => setOpen(false)}
                                aria-current={isActive(item) ? "page" : undefined}
                                className={`border-b border-gold-line py-3 text-sm font-semibold transition-colors hover:text-gold-ink ${
                                    isActive(item) ? "text-gold-ink" : "text-ink"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {auth?.user ? (
                        <div className="mt-4 flex flex-col">
                            <p className="pb-1 text-[11px] font-bold uppercase tracking-[1.5px] text-gold-ink">
                                Akun Saya
                            </p>
                            {ACCOUNT_LINKS.map((item) => (
                                <a
                                    key={item.label}
                                    href={hrefOf(item)}
                                    className="py-2 text-sm text-ink-soft transition-colors hover:text-ink"
                                >
                                    {item.label}
                                </a>
                            ))}
                            <Link
                                href={safeRoute("logout")}
                                method="post"
                                as="button"
                                className="mt-1 py-2 text-left text-sm text-red-600"
                            >
                                Logout
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href={safeRoute("login")}
                            onClick={() => setOpen(false)}
                            className="mt-5 inline-flex rounded-[40px] bg-ink px-[23px] py-3.5 text-[13px] font-semibold leading-5 text-cream"
                        >
                            My Account
                        </Link>
                    )}
                </div>
            )}
        </header>
    );
}

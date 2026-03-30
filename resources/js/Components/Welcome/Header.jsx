import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { route } from "ziggy-js";

export default function Header() {
    const { auth, settings } = usePage().props;
    const [open, setOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        // Close dropdown on click outside
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setAccountOpen(false);
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navClass = scrolled || open ? "text-slate-900" : "text-white";
    const headerClass =
        scrolled || open
            ? "bg-white border-b border-slate-200 shadow-sm"
            : "bg-slate-700/20 border-b border-transparent";

    return (
        <header
            className={`sticky top-0 z-50 transition-colors duration-300 ${headerClass}`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/">
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
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <nav
                        className={`hidden min-[900px]:flex items-center gap-2 xl:gap-3 text-[0.7rem] xl:text-sm font-medium uppercase tracking-wide ${navClass}`}
                    >
                        <Link
                            href="/"
                            className="hover:text-emerald-600 transition-colors"
                        >
                            HOME
                        </Link>
                        <span className="text-slate-300">|</span>
                        <Link
                            href="/investments"
                            className="hover:text-emerald-600 transition-colors"
                        >
                            INVESTMENT
                        </Link>
                        <span className="text-slate-300">|</span>
                        <Link
                            href="/crowdfunding"
                            className="hover:text-emerald-600 transition-colors"
                        >
                            CROWDFUNDING
                        </Link>
                        <span className="text-slate-300">|</span>
                        <Link
                            href="#property"
                            className="hover:text-emerald-600 transition-colors"
                        >
                            PROPERTY FOR SALE
                        </Link>
                        <span className="text-slate-300">|</span>
                        <Link
                            href={route("auctions.index")}
                            className="hover:text-emerald-600 transition-colors"
                        >
                            LELANG/CESSIE
                        </Link>
                        <span className="text-slate-300">|</span>
                        <Link
                            href="/how-to-invest"
                            className="hover:text-emerald-600 transition-colors"
                        >
                            HOW TO INVEST
                        </Link>
                        <span className="text-slate-300">|</span>

                        {/* MY ACCOUNT Dropdown Version */}
                        {auth.user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setAccountOpen(!accountOpen)}
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
                                            <a
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                Logouts
                                            </a>
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
                            onClick={() => setOpen(!open)}
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!open ? (
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

            {/* Mobile Menu Content */}
            {open && (
                <div
                    className="min-[900px]:hidden bg-white border-t border-slate-200"
                    id="mobile-menu"
                >
                    <div className="space-y-1 px-4 py-6">
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
                            href={route("auctions.index")}
                            className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600"
                        >
                            LELANG/CESSIE
                        </Link>
                        <Link
                            href="/how-to-invest"
                            className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600"
                        >
                            HOW TO INVEST
                        </Link>

                        <div className="mt-4 border-t border-slate-100 pt-4">
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
                                                href={route("user.profile")}
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                                            >
                                                My Profile
                                            </a>
                                            <a
                                                href={route("user.portfolio")}
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                                            >
                                                My Portfolio
                                            </a>
                                            <div className="border-t border-slate-100 mt-1">
                                                <form
                                                    method="POST"
                                                    action={route("logout")}
                                                >
                                                    <button
                                                        type="submit"
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        Logout
                                                    </button>
                                                </form>
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
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

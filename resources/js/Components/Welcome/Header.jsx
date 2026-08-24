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

    /*
     * ============================================================
     * COLORS
     * ============================================================
     * Menu      : Dark Gray
     * Account   : Dark Gold
     * Hover     : Light Gray / Gold
     */

    const navClass =
        scrolled || open
            ? "text-slate-800"
            : "text-slate-100";

    const headerClass =
        scrolled || open
            ? "bg-[#f5f3ef]/95 backdrop-blur-md border-b border-slate-300/40"
            : "bg-black/20 backdrop-blur-sm border-b border-white/10";

    return (
        <header
            className={`sticky top-0 z-50 transition-colors duration-300 ${headerClass}`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="flex h-20 items-center justify-between">

                    {/* =====================================================
                        LOGO
                    ====================================================== */}
                    <div className="flex flex-shrink-0 items-center gap-3">

                        <a
                            href="/"
                            className="flex items-center gap-3"
                        >
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
                                className="
                                    h-10
                                    w-auto
                                    max-w-[150px]
                                    object-contain
                                    sm:h-12
                                    sm:max-w-[200px]
                                    lg:h-14
                                "
                            />

                            {/* Site Name */}
                            <span
                                className={`
                                    text-lg
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    ${
                                        scrolled || open
                                            ? "text-slate-900"
                                            : "text-white"
                                    }
                                `}
                            >
                                {settings?.site_name || "Gain Properties"}
                            </span>
                        </a>

                    </div>


                    {/* =====================================================
                        DESKTOP MENU
                    ====================================================== */}
                    <nav
                        className={`
                            hidden
                            min-[900px]:flex
                            items-center
                            gap-2
                            xl:gap-3
                            text-[0.7rem]
                            xl:text-sm
                            font-medium
                            uppercase
                            tracking-wide
                            ${navClass}
                        `}
                    >

                        {/* HOME */}
                        <Link
                            href="/"
                            className="
                                transition-colors
                                hover:text-slate-500
                            "
                        >
                            HOME
                        </Link>

                        <span
                            className={
                                scrolled
                                    ? "text-slate-300"
                                    : "text-white/30"
                            }
                        >
                            |
                        </span>


                        {/* INVESTMENT */}
                        <Link
                            href="/investments"
                            className="
                                transition-colors
                                hover:text-slate-500
                            "
                        >
                            INVESTMENT
                        </Link>

                        <span
                            className={
                                scrolled
                                    ? "text-slate-300"
                                    : "text-white/30"
                            }
                        >
                            |
                        </span>


                        {/* CROWDFUNDING */}
                        <Link
                            href="/crowdfunding"
                            className="
                                transition-colors
                                hover:text-slate-500
                            "
                        >
                            CROWDFUNDING
                        </Link>

                        <span
                            className={
                                scrolled
                                    ? "text-slate-300"
                                    : "text-white/30"
                            }
                        >
                            |
                        </span>


                        {/* PROPERTY FOR SALE */}
                        <Link
                            href="/property-for-sale"
                            className="
                                transition-colors
                                hover:text-slate-500
                            "
                        >
                            PROPERTY FOR SALE
                        </Link>

                        <span
                            className={
                                scrolled
                                    ? "text-slate-300"
                                    : "text-white/30"
                            }
                        >
                            |
                        </span>


                        {/* HOW TO INVEST */}
                        <Link
                            href="/how-to-invest"
                            className="
                                transition-colors
                                hover:text-slate-500
                            "
                        >
                            HOW TO INVEST
                        </Link>

                        <span
                            className={
                                scrolled
                                    ? "text-slate-300"
                                    : "text-white/30"
                            }
                        >
                            |
                        </span>


                        {/* =================================================
                            MY ACCOUNT
                        ================================================== */}
                        {auth.user ? (

                            <div
                                className="relative"
                                ref={dropdownRef}
                            >

                                <button
                                    onClick={() =>
                                        setAccountOpen(!accountOpen)
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                        font-bold
                                        uppercase
                                        text-[#9f7d3f]
                                        transition-colors
                                        duration-200
                                        hover:text-[#c9a45c]
                                        focus:outline-none
                                    "
                                >
                                    MY ACCOUNT

                                    <svg
                                        className={`
                                            h-4
                                            w-4
                                            transition-transform
                                            duration-200
                                            ${
                                                accountOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }
                                        `}
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


                                {/* Dropdown */}
                                {accountOpen && (
                                    <div
                                        className="
                                            absolute
                                            right-0
                                            z-50
                                            mt-3
                                            w-48
                                            rounded-lg
                                            border
                                            border-slate-200
                                            bg-white
                                            py-2
                                            shadow-xl
                                            normal-case
                                        "
                                    >

                                        <a
                                            href={route("user.dashboard")}
                                            className="
                                                block
                                                px-4
                                                py-2
                                                text-sm
                                                text-slate-700
                                                transition-colors
                                                hover:bg-slate-100
                                                hover:text-slate-900
                                            "
                                        >
                                            Dashboard
                                        </a>

                                        <a
                                            href={route("user.portfolio")}
                                            className="
                                                block
                                                px-4
                                                py-2
                                                text-sm
                                                text-slate-700
                                                transition-colors
                                                hover:bg-slate-100
                                                hover:text-slate-900
                                            "
                                        >
                                            My Portfolio
                                        </a>

                                        <a
                                            href={route("user.portfolio")}
                                            className="
                                                block
                                                px-4
                                                py-2
                                                text-sm
                                                text-slate-700
                                                transition-colors
                                                hover:bg-slate-100
                                                hover:text-slate-900
                                            "
                                        >
                                            My Bids
                                        </a>

                                        <a
                                            href={route("user.portfolio")}
                                            className="
                                                block
                                                px-4
                                                py-2
                                                text-sm
                                                text-slate-700
                                                transition-colors
                                                hover:bg-slate-100
                                                hover:text-slate-900
                                            "
                                        >
                                            Transactions
                                        </a>

                                        <a
                                            href={route("user.portfolio")}
                                            className="
                                                block
                                                px-4
                                                py-2
                                                text-sm
                                                text-slate-700
                                                transition-colors
                                                hover:bg-slate-100
                                                hover:text-slate-900
                                            "
                                        >
                                            Account Setting
                                        </a>


                                        {/* Logout */}
                                        <div className="mt-1 border-t border-slate-100">

                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="
                                                    w-full
                                                    px-3
                                                    py-2
                                                    text-left
                                                    text-sm
                                                    text-red-600
                                                    transition-colors
                                                    hover:bg-red-50
                                                "
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
                                className="
                                    font-bold
                                    text-[#9f7d3f]
                                    transition-colors
                                    hover:text-[#c9a45c]
                                "
                            >
                                MY ACCOUNT
                            </a>

                        )}

                    </nav>


                    {/* =====================================================
                        MOBILE MENU BUTTON
                    ====================================================== */}
                    <div className="flex min-[900px]:hidden">

                        <button
                            onClick={() => setOpen(!open)}
                            type="button"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-md
                                p-2
                                text-slate-700
                                transition
                                hover:bg-slate-100
                                hover:text-slate-900
                                focus:outline-none
                                focus:ring-2
                                focus:ring-inset
                                focus:ring-[#c9a45c]
                            "
                        >

                            <span className="sr-only">
                                Open main menu
                            </span>

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


            {/* =============================================================
                MOBILE MENU
            ============================================================= */}
            {open && (

                <div
                    className="
                        relative
                        z-50
                        min-[900px]:hidden
                        border-t
                        border-slate-200
                        bg-white
                    "
                    id="mobile-menu"
                >

                    <div className="space-y-1 px-4 py-6">

                        {/* HOME */}
                        <Link
                            href="/"
                            className="
                                block
                                rounded-md
                                px-3
                                py-2
                                text-base
                                font-medium
                                text-slate-900
                                transition
                                hover:bg-slate-100
                                hover:text-slate-600
                            "
                        >
                            HOME
                        </Link>


                        {/* INVESTMENT */}
                        <Link
                            href={route("investments.index")}
                            className="
                                block
                                rounded-md
                                px-3
                                py-2
                                text-base
                                font-medium
                                text-slate-900
                                transition
                                hover:bg-slate-100
                                hover:text-slate-600
                            "
                        >
                            INVESTMENT
                        </Link>


                        {/* CROWDFUNDING */}
                        <Link
                            href={route("crowdfunding.index")}
                            className="
                                block
                                rounded-md
                                px-3
                                py-2
                                text-base
                                font-medium
                                text-slate-900
                                transition
                                hover:bg-slate-100
                                hover:text-slate-600
                            "
                        >
                            CROWDFUNDING
                        </Link>


                        {/* PROPERTY FOR SALE */}
                        <Link
                            href={route("property-for-sale.index")}
                            className="
                                block
                                rounded-md
                                px-3
                                py-2
                                text-base
                                font-medium
                                text-slate-900
                                transition
                                hover:bg-slate-100
                                hover:text-slate-600
                            "
                        >
                            PROPERTY FOR SALE
                        </Link>


                        {/* HOW TO INVEST */}
                        <Link
                            href="/how-to-invest"
                            className="
                                block
                                rounded-md
                                px-3
                                py-2
                                text-base
                                font-medium
                                text-slate-900
                                transition
                                hover:bg-slate-100
                                hover:text-slate-600
                            "
                        >
                            HOW TO INVEST
                        </Link>


                        {/* =================================================
                            MOBILE ACCOUNT
                        ================================================== */}
                        <div
                            className="
                                mt-4
                                border-t
                                border-slate-100
                                pt-4
                            "
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
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            rounded-md
                                            px-3
                                            py-2
                                            text-base
                                            font-bold
                                            uppercase
                                            text-[#9f7d3f]
                                            transition
                                            hover:bg-[#f5f1e8]
                                            hover:text-[#80652f]
                                        "
                                    >
                                        <span>
                                            MY ACCOUNT
                                        </span>
                                    </button>


                                    {/* Dropdown */}
                                    {accountOpen && (

                                        <div
                                            className="
                                                relative
                                                z-[999]
                                                ml-4
                                                mt-1
                                                space-y-1
                                                normal-case
                                            "
                                        >

                                            <a
                                                href={route("user.dashboard")}
                                                className="
                                                    block
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    text-slate-700
                                                    transition
                                                    hover:bg-slate-100
                                                    hover:text-slate-900
                                                "
                                            >
                                                Dashboard
                                            </a>

                                            <a
                                                href={route("user.portfolio")}
                                                className="
                                                    block
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    text-slate-700
                                                    transition
                                                    hover:bg-slate-100
                                                    hover:text-slate-900
                                                "
                                            >
                                                My Portfolio
                                            </a>

                                            <a
                                                href={route("user.portfolio")}
                                                className="
                                                    block
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    text-slate-700
                                                    transition
                                                    hover:bg-slate-100
                                                    hover:text-slate-900
                                                "
                                            >
                                                My Bids
                                            </a>

                                            <a
                                                href={route("user.portfolio")}
                                                className="
                                                    block
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    text-slate-700
                                                    transition
                                                    hover:bg-slate-100
                                                    hover:text-slate-900
                                                "
                                            >
                                                Transactions
                                            </a>

                                            <a
                                                href={route("user.portfolio")}
                                                className="
                                                    block
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    text-slate-700
                                                    transition
                                                    hover:bg-slate-100
                                                    hover:text-slate-900
                                                "
                                            >
                                                Account Setting
                                            </a>


                                            {/* Logout */}
                                            <div className="mt-2 border-t border-slate-100 pt-1">

                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                    className="
                                                        w-full
                                                        px-3
                                                        py-2
                                                        text-left
                                                        text-sm
                                                        text-red-600
                                                        transition
                                                        hover:bg-red-50
                                                    "
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
                                    className="
                                        px-3
                                        py-2
                                        font-bold
                                        text-[#9f7d3f]
                                        transition-colors
                                        hover:text-[#c9a45c]
                                    "
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
import { Link } from "@inertiajs/react";

/*
 * Footer — mengikuti mockup Figma.
 *
 * Empat kolom: brand (lebar tetap 320px) + tiga kolom tautan yang membagi
 * sisa ruang, lalu baris legal di bawah garis pemisah.
 *
 * Blok campaign dan partner sudah dipindah ke Promo.jsx dan
 * TrustedPartners.jsx sesuai mockup, yang memperlakukan keduanya sebagai
 * seksi tersendiri.
 */

/* Ziggy melempar bila nama route belum terdaftar; footer tidak boleh ikut
 * menjatuhkan halaman hanya karena satu route hilang. */
function safeRoute(name, fallback) {
    try {
        return route(name);
    } catch {
        return fallback;
    }
}

const EXPLORE = [
    { label: "Investment", href: "/investments" },
    { label: "Crowdfunding", href: "/crowdfunding" },
    { label: "Property for Sale", href: "/property-for-sale" },
    { label: "How to Invest", href: "/how-to-invest" },
];

const CERTIFICATIONS = [
    {
        href: "https://pse.komdigi.go.id",
        src: "/assets/img/komdigi.svg",
        alt: "Terdaftar PSE Komdigi",
    },
    {
        href: "https://kan.or.id",
        src: "/assets/img/kan.svg",
        alt: "Terakreditasi KAN",
    },
];

const SOCIAL_ICONS = {
    facebook:
        "M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.3 3h-1.9v7A10 10 0 0022 12z",
    instagram:
        "M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm6-1a1 1 0 100 2 1 1 0 000-2z",
    youtube:
        "M23.5 6.2a3 3 0 00-2.1-2.1C19.8 3.6 12 3.6 12 3.6s-7.8 0-9.4.5A3 3 0 00.6 6.2 31.6 31.6 0 000 12a31.6 31.6 0 00.6 5.8 3 3 0 002.1 2.1c1.6.5 9.4.5 9.4.5s7.8 0 9.4-.5a3 3 0 002.1-2.1c.4-1.9.6-3.8.6-5.8s-.2-3.9-.6-5.8zM9.7 15.5V8.5l6.2 3.5-6.2 3.5z",
};

const LINK =
    "text-[13px] leading-5 text-cream/75 transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";
const EYEBROW =
    "text-[11px] uppercase leading-[17px] tracking-[1.5px] text-gold";

export default function Footer({ settings }) {
    const logoSrc = settings?.logo
        ? settings.logo.startsWith("http") || settings.logo.startsWith("/")
            ? settings.logo
            : `/storage/${settings.logo}`
        : null;

    const siteName = settings?.site_name || "Gain Properties";

    /* wa.me menolak tanda "+", tapi nomor internasional lebih terbaca
     * dengan awalan itu. Jadi tautannya polos, tampilannya berawalan. */
    const waNumber = settings?.whatsapp?.replace(/[^\d]/g, "");
    const waDisplay = waNumber ? `+${waNumber}` : null;

    const socials = [
        { url: settings?.facebook_url, label: "Facebook", d: SOCIAL_ICONS.facebook },
        { url: settings?.instagram_url, label: "Instagram", d: SOCIAL_ICONS.instagram },
        { url: settings?.youtube_url, label: "YouTube", d: SOCIAL_ICONS.youtube },
    ].filter((item) => item.url);

    return (
        <footer className="w-full bg-ink text-cream/75">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 pb-8 pt-16 sm:px-10 lg:px-[72px]">
                {/* ================= KOLOM ================= */}
                <div className="flex flex-col gap-10 lg:flex-row lg:gap-11">
                    {/* Brand + sertifikasi */}
                    <div className="flex flex-col gap-5 lg:w-[320px] lg:shrink-0">
                        <div className="flex items-center gap-3">
                            {logoSrc && (
                                <img
                                    src={logoSrc}
                                    alt=""
                                    className="h-12 w-auto max-w-[56px] shrink-0 object-contain"
                                />
                            )}
                            <span className="text-[16px] font-bold leading-[25px] text-cream">
                                {siteName}
                            </span>
                        </div>

                        {settings?.description && (
                            <p className="text-[13px] leading-5 text-cream/75">
                                {settings.description}
                            </p>
                        )}

                        <div className="flex flex-col gap-3">
                            <p className="text-[10px] uppercase leading-4 tracking-[1px] text-gold">
                                Registered &amp; Certified On
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                                {CERTIFICATIONS.map((cert) => (
                                    <a
                                        key={cert.alt}
                                        href={cert.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center rounded-xl border border-white/10 bg-cream px-3.5 py-2.5 transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                                    >
                                        <img
                                            src={cert.src}
                                            alt={cert.alt}
                                            loading="lazy"
                                            className="h-[35px] w-auto max-w-[72px] object-contain"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Explore */}
                    <nav
                        aria-label="Jelajahi"
                        className="flex flex-1 flex-col items-start gap-[18px]"
                    >
                        <p className={EYEBROW}>Explore</p>
                        {EXPLORE.map((item) => (
                            <Link key={item.label} href={item.href} className={LINK}>
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Membership */}
                    <nav
                        aria-label="Keanggotaan"
                        className="flex flex-1 flex-col items-start gap-[18px]"
                    >
                        <p className={EYEBROW}>Membership</p>
                        <Link href={safeRoute("login", "/login")} className={LINK}>
                            Member Login
                        </Link>
                        <Link href={safeRoute("register", "/register")} className={LINK}>
                            Member Register
                        </Link>
                    </nav>

                    {/* Kontak */}
                    <div className="flex flex-1 flex-col items-start gap-[18px]">
                        <p className={EYEBROW}>Get In Touch</p>

                        {settings?.address && (
                            <address className="text-[13px] not-italic leading-5 text-cream/75">
                                {settings.address}
                            </address>
                        )}

                        {settings?.whatsapp && (
                            <a
                                href={`https://wa.me/${waNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={LINK}
                            >
                                {waDisplay}
                            </a>
                        )}

                        {settings?.email && (
                            <a href={`mailto:${settings.email}`} className={LINK}>
                                {settings.email}
                            </a>
                        )}

                        {socials.length > 0 && (
                            <ul className="flex items-center gap-2.5 pt-2">
                                {socials.map((item) => (
                                    <li key={item.label}>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={item.label}
                                            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cream/75 transition-colors before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] hover:border-gold/50 hover:bg-gold/10 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                                        >
                                            <svg
                                                className="h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path d={item.d} />
                                            </svg>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* ================= LEGAL ================= */}
                <div className="flex flex-col gap-4 border-t border-white/15 pt-6 text-[11px] leading-[17px] text-cream/75 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex-1">
                        &copy; {new Date().getFullYear()} {siteName}. All rights
                        reserved.
                    </p>
                    <div className="flex gap-8">
                        <a
                            href="/privacy-policy"
                            className="transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href={safeRoute("terms", "/terms")}
                            className="transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                        >
                            Terms &amp; Conditions
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

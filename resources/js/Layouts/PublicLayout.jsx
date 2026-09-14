import { usePage } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";

import Header from "@/Components/Welcome/Header";
import Promo from "@/Components/Welcome/Promo";
import TrustedPartners from "@/Components/Welcome/TrustedPartners";
import Footer from "@/Components/Welcome/Footer";

/*
 * Layout publik — satu-satunya kerangka untuk seluruh halaman publik,
 * termasuk Home.
 *
 * Sebelumnya file ini memuat header (640 baris) dan footer (641 baris)
 * sendiri, menduplikasi komponen di Components/Welcome/. Akibatnya Home
 * dan 14 halaman lain memakai dua sistem yang berbeda, dan setiap
 * penambahan menu harus dikerjakan dua kali. Keduanya kini diimpor.
 *
 * Promo dan Trusted Partners tetap muncul di setiap halaman seperti
 * perilaku sebelumnya, hanya saja kini berdiri sebagai seksi tersendiri,
 * bukan tertanam di dalam <footer>.
 */
export default function PublicLayout({ children }) {
    const { settings, partners, campaigns } = usePage().props;

    return (
        <div className="flex min-h-screen flex-col bg-cream font-sans text-ink antialiased">
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#242620",
                        color: "#FAF9F6",
                        borderRadius: "0.75rem",
                    },
                    success: {
                        style: { background: "#242620", color: "#C7A45C" },
                    },
                    error: {
                        style: { background: "#7F1D1D", color: "#FAF9F6" },
                    },
                }}
            />

            <Header />

            <main className="flex-1">{children}</main>

            <Promo campaigns={campaigns} />
            <TrustedPartners partners={partners} />
            <Footer settings={settings} />
        </div>
    );
}

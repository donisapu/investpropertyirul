import { usePage } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";

import Header from "@/Components/Welcome/Header";
import Promo from "@/Components/Welcome/Promo";
import TrustedPartners from "@/Components/Welcome/TrustedPartners";
import Footer from "@/Components/Welcome/Footer";

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

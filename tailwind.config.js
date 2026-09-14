import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
        "./resources/js/**/*.js",
    ],

    theme: {
        extend: {
            screens: {
                md900: "900px",
            },
            transitionTimingFunction: {
                // Kurva yang sama dengan --ease-* di app.css
                "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
                "out-quint": "cubic-bezier(0.22, 1, 0.36, 1)",
                "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
            },
            fontFamily: {
                sans: ["Manrope", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                mono: {
                    900: "#121212",
                    700: "#444444",
                    500: "#888888",
                    300: "#B0B0B0",
                    100: "#E0E0E0",
                },

                /*
                 * Sistem warna landing - nilai diambil dari mockup Figma
                 * (export Pencil). Putih dominan, hitam sebagai blok
                 * kontras, emas sebagai aksen (~10%).
                 *
                 * Emas punya DUA tingkat. Emas mockup #c7a45c hanya
                 * 2,24:1 di atas cream, jadi GAGAL WCAG AA untuk teks
                 * kecil - dan 30 dari 31 teks emas di mockup berukuran
                 * 10-13px. Pilih berdasarkan ground:
                 *   gold      -> ground gelap / teks besar (6,48:1 di ink)
                 *   gold.ink  -> TEKS KECIL di ground terang
                 *                (5,38 cream / 4,92 deep / 4,65 sink)
                 * Keduanya nyaris tak terbedakan mata.
                 */
                cream: {
                    DEFAULT: "#FAF9F6", // ground utama
                    deep: "#F0EFE9",    // seksi selang-seling
                    sink: "#EAE9E0",    // panel tenggelam (Return Calculator)
                },
                ink: {
                    DEFAULT: "#242620", // blok kontras, teks utama (14,53:1)
                    soft: "#686A61",    // teks sekunder (5,22:1 di cream)
                },
                gold: {
                    DEFAULT: "#C7A45C", // aksen di ground gelap & teks besar
                    ink: "#866020",     // teks kecil di ground terang
                    line: "#DDDCD3",    // pembatas halus
                    edge: "#C6C8BC",    // pembatas lebih tegas
                },
            },
        },
    },

    plugins: [],
};

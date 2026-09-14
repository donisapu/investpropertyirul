import React from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, Check } from "lucide-react";
import useReveal from "@/hooks/useReveal";

export default function Howto({ auth, landings }) {
    // Tiga blok terpisah: band, Cara Kerja, Cara Berinvestasi.
    // Seksi ini terlalu tinggi untuk diungkap sebagai satu kesatuan.
    const revealBand = useReveal();
    const revealSteps = useReveal();
    const revealMethods = useReveal();

    // Helper fungsi aman untuk route Ziggy agar tidak bikin blank jika route belum terdefinisi
    const safeRoute = (routeName, fallback = "#") => {
        try {
            return typeof route === "function" ? route(routeName) : fallback;
        } catch (e) {
            return fallback;
        }
    };

    // Data Langkah-langkah Cara Kerja Investasi
    const steps = [
        {
            title: "1. Jelajahi Properti",
            description:
                "Telusuri pilihan properti pilihan kami yang berpotensi tinggi. Filter berdasarkan lokasi, harga, dan jenis investasi.",
        },
        {
            title: "2. Tinjau Detail",
            description:
                "Analisis laporan terperinci, proyeksi keuangan, dan dokumen hukum untuk setiap properti. Kami menjamin transparansi penuh.",
        },
        {
            title: "3. Pilih Metode Anda",
            description:
                "Tentukan apakah Anda ingin berinvestasi melalui ekuitas ter-tokenisasi, pinjaman fraksional, atau kepemilikan penuh.",
        },
        {
            title: "4. Investasikan & Dapatkan Hasil",
            description:
                "Selesaikan transaksi Anda dengan aman. Pantau performa portofolio Anda dan terima imbal hasil langsung ke dompet Anda.",
        },
    ];


    const methods = [
        {
            title: "Investasi Properti",
            description:
                "Beli lot properti untuk kepemilikan ekuitas langsung. Dapatkan keuntungan dari kenaikan nilai modal dan potensi dividen sewa.",
            features: [
                "Ekuitas ter-tokenisasi",
                "Kenaikan nilai modal",
                "Jangka menengah-panjang",
                "Porsi kepemilikan langsung",
            ],
            link: safeRoute("investments.index", "/investments"),
        },
        {
            title: "Urun Dana (Crowdfunding)",
            description:
                "Berpartisipasi dalam pendanaan properti secara kolektif. Dapatkan imbal hasil pasti dalam jangka waktu tertentu.",
            features: [
                "Tenor & ROI pasti",
                "Minimum investasi rendah",
                "Passive income",
                "Jangka pendek-menengah",
            ],
            link: safeRoute("crowdfunding.index", "/crowdfunding"),
        },
        {
            title: "Lelang & Cessie",
            description:
                "Ajukan penawaran untuk properti di bawah harga pasar. Dapatkan hak kepemilikan penuh melalui proses lelang transparan.",
            features: [
                "Di bawah harga pasar",
                "Kepemilikan penuh",
                "Potensi imbal hasil tinggi",
                "Jual beli aset cepat",
            ],
            link: safeRoute("auctions.index", "/auctions"),
        },
    ];

    return (
        <section className="w-full">
            {/* 1. BANNER MULAI PERJALANAN INVESTASI (rata kiri, CTA kanan) */}
            <div ref={revealBand.ref} className={`w-full bg-ink px-6 py-12 text-cream sm:px-10 lg:px-[72px] ${revealBand.className}`}>
                <div className="mx-auto flex max-w-[1440px] flex-col gap-6 lg:flex-row lg:items-center lg:gap-16">
                    <div className="flex flex-1 flex-col gap-2.5">
                        <h2 className="text-[clamp(1.5rem,3.2vw,2rem)] font-semibold leading-[1.25]">
                            Mulai Perjalanan Investasi Properti Anda
                        </h2>
                        <p className="max-w-[65ch] text-[15px] leading-[23px] text-cream/70">
                            Kami membuat investasi properti menjadi mudah
                            diakses, transparan, dan menguntungkan.
                        </p>
                    </div>

                    {!auth?.user && (
                        <Link
                            href={safeRoute("register", "/register")}
                            className="group inline-flex w-fit shrink-0 items-center gap-[22px] rounded-[40px] bg-gold px-[23px] py-4 text-[13px] font-semibold leading-5 text-ink transition-colors hover:bg-gold/90"
                        >
                            Buat Akun Gratis
                            <ArrowRight
                                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                aria-hidden="true"
                            />
                        </Link>
                    )}
                </div>
            </div>

            {/* 2. CARA KERJA (judul kiri, subteks kanan, langkah bergaris atas) */}
            <div ref={revealSteps.ref} className={`w-full bg-cream px-6 py-16 sm:px-10 lg:px-[72px] lg:py-20 ${revealSteps.className}`}>
                <div className="mx-auto flex max-w-[1440px] flex-col gap-9">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-12">
                        <h2 className="flex-1 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.2] text-ink">
                            Cara Kerja
                        </h2>
                        <p className="flex-1 text-[16px] leading-[25px] text-ink-soft">
                            Langkah mudah untuk mulai berinvestasi.
                        </p>
                    </div>

                    {/*
                     * Nomor urut menggantikan chip ikon bundar yang dipakai
                     * versi lama. Garis tipis di atas tiap langkah memberi
                     * struktur tanpa menambah kotak.
                     */}
                    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step, index) => (
                            <li
                                key={step.title}
                                className="flex flex-col items-start gap-[18px] border-t border-gold-line pt-[22px]"
                            >
                                <span className="text-[13px] leading-5 text-gold-ink">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-[18px] font-semibold leading-7 text-ink">
                                        {step.title}
                                    </h3>
                                    <p className="text-[14px] leading-[22px] text-ink-soft">
                                        {step.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* 3. CARA BERINVESTASI — tabel perbandingan (sesuai mockup) */}
            <div ref={revealMethods.ref} className={`w-full bg-cream-deep px-6 py-16 sm:px-10 lg:px-[72px] lg:pb-20 lg:pt-16 ${revealMethods.className}`}>
                <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-9">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.2] text-ink">
                            Cara Berinvestasi
                        </h2>
                        <p className="max-w-[60ch] text-[16px] leading-[25px] text-ink-soft">
                            Pilih model investasi yang paling sesuai dengan
                            profil risiko dan dana Anda.
                        </p>
                    </div>

                    {/*
                     * Tiga kartu dibaca menyamping sebagai perbandingan, jadi
                     * deskripsi diberi tinggi minimum agar daftar benefit
                     * sejajar antar kolom. Memakai min-h, bukan tinggi mati
                     * seperti di mockup, supaya teks panjang tidak terpotong.
                     */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {methods.map((method) => (
                            <div
                                key={method.title}
                                className="flex h-full flex-col gap-5 rounded-xl bg-cream p-7"
                            >
                                <h3 className="text-[23px] font-semibold leading-9 text-ink">
                                    {method.title}
                                </h3>

                                <p className="text-[14px] leading-[22px] text-ink-soft lg:min-h-[110px]">
                                    {method.description}
                                </p>

                                <ul className="flex flex-col gap-2.5">
                                    {method.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-center gap-2.5 text-[14px] leading-[22px] text-ink"
                                        >
                                            <Check
                                                className="h-4 w-4 shrink-0 text-gold-ink"
                                                aria-hidden="true"
                                            />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto border-t border-gold-line pt-5">
                                    <Link
                                        href={method.link}
                                        className="group inline-flex min-h-[44px] items-center gap-2 text-[13px] font-bold leading-5 text-ink transition-colors hover:text-gold-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink"
                                    >
                                        Lihat {method.title}
                                        <ArrowRight
                                            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
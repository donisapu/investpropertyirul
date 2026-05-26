import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Bed,
    Bath,
    Maximize,
    Building2,
    Calendar,
    Banknote,
    MonitorCheck,
    Settings2,
    SearchCheck,
    ChevronRight,
    LayoutGrid,
    CheckCircle2,
    ChevronLeft,
    ShieldCheck,
    TrendingUp,
    Users,
    ArrowUpRight,
} from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

export default function Crowdfunding({ properties, settings }) {
    return (
        <PublicLayout>
            <Head title="Crowdfunding" />

            {/* Hero Section dengan Background Gradient Lembut */}
            <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        {/* Left Side: Content */}
                        <div className="flex-1 text-center md:text-left z-10">
                            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#24608B] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-blue-100">
                                <ShieldCheck size={14} /> Reliable Property
                                Investment Platform
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 leading-tight mb-6 tracking-tight">
                                Now Everyone Can Invest{" "}
                                <br className="hidden md:block" />
                                <span className="bg-gradient-to-r from-[#24608B] to-blue-500 bg-clip-text text-transparent">
                                    in Real Estate
                                </span>
                            </h2>
                            <p className="text-slate-500 text-lg mb-8 max-w-xl leading-relaxed">
                                Powered by technology and crowdfunding,
                                investing in curated property assets is now
                                easier and safer, starting from just IDR 1
                                million.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                                <button className="bg-[#24608B] hover:bg-[#1d4d70] text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/10 hover:shadow-xl active:scale-98">
                                    Invest Now
                                </button>
                                <a
                                    href="#projects"
                                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3.5 rounded-xl font-semibold transition-all"
                                >
                                    View Project <ArrowUpRight size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Right Side: Illustration */}
                        <div className="flex-1 relative flex justify-center items-center">
                            <div className="absolute w-[400px] h-[400px] bg-blue-200 rounded-full -z-10 blur-[80px] opacity-40 animate-pulse"></div>

                            <div className="relative w-full max-w-md p-4">
                                <img
                                    src="/crowdfunding.svg"
                                    alt="Ilustrasi Provesty"
                                    className="w-full h-auto object-contain drop-shadow-2xl"
                                />

                                {/* Floating Card Info */}
                                <div className="absolute -bottom-2 -left-2 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 transition-transform hover:scale-105 duration-300">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
                                        <Banknote size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            Secured Investment
                                        </div>
                                        <div className="text-base font-extrabold text-slate-800">
                                            Start From IDR 1 Million
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Keunggulan Platform dengan Main Title */}
            <div className="bg-slate-50/60 py-20 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                            Why Invest With Us?
                        </h3>
                        <p className="text-slate-500 text-sm md:text-base">
                            We create a transparent, secure, and inclusive
                            crowdfunding ecosystem designed to help grow your
                            wealth.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Mudah */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                                <MonitorCheck className="w-6 h-6 text-[#24608B] group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 mb-3">
                                Easy
                            </h4>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Sign up in 5 minutes & start investing from just
                                IDR 1 million.
                            </p>
                        </div>

                        {/* Transparan */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                                <Settings2 className="w-6 h-6 text-[#24608B] group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 mb-3">
                                Transparent
                            </h4>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Monitor your investment progress in{" "}
                                <span className="italic font-medium text-slate-700">
                                    real-time
                                </span>{" "}
                                with zero hidden fees.
                            </p>
                        </div>

                        {/* Terjamin */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                                <SearchCheck className="w-6 h-6 text-[#24608B] group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 mb-3">
                                Secure
                            </h4>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Your funds are secured by residential property
                                assets as primary collateral.
                            </p>
                        </div>

                        {/* Diversifikasi */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                                <LayoutGrid className="w-6 h-6 text-[#24608B] group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 mb-3">
                                Diversified
                            </h4>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Reduce risk by diversifying investments across
                                multiple property listings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How to Invest Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-3">
                        How To Invest
                    </h2>
                    <p className="text-slate-500 mb-20 max-w-md mx-auto text-sm md:text-base">
                        Start your property flipping investment in just 3 simple
                        steps.
                    </p>

                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-6">
                        {/* Langkah 1 */}
                        <div className="flex-1 flex flex-col items-center max-w-sm group">
                            <div className="relative mb-6 h-40 w-40 flex items-center justify-center bg-slate-50 rounded-full transition-transform group-hover:scale-105 duration-300">
                                <div className="w-28 h-28 bg-blue-50/60 rounded-full flex items-center justify-center text-[#24608B]">
                                    <MonitorCheck size={48} strokeWidth={1.5} />
                                </div>
                                <div className="absolute -top-1 -right-1 bg-[#E0F2FE] text-[#24608B] px-3.5 py-1 rounded-xl text-xs font-bold shadow-sm border border-blue-200">
                                    01. Discover
                                </div>
                            </div>
                            <h4 className="text-slate-800 font-bold text-lg mb-2">
                                Discover
                            </h4>
                            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                                Find curated property flipping opportunities.
                                Review return projections and collateral
                                details.
                            </p>
                        </div>

                        <div className="hidden lg:block text-slate-300 mb-10">
                            <ChevronRight size={28} />
                        </div>

                        {/* Langkah 2 */}
                        <div className="flex-1 flex flex-col items-center max-w-sm group">
                            <div className="relative mb-6 h-40 w-40 flex items-center justify-center bg-slate-50 rounded-full transition-transform group-hover:scale-105 duration-300">
                                <div className="w-28 h-28 bg-blue-50/60 rounded-full flex items-center justify-center text-[#24608B]">
                                    <Banknote size={48} strokeWidth={1.5} />
                                </div>
                                <div className="absolute -top-1 -right-1 bg-[#E0F2FE] text-[#24608B] px-3.5 py-1 rounded-xl text-xs font-bold shadow-sm border border-blue-200">
                                    02. Invest
                                </div>
                            </div>
                            <h4 className="text-slate-800 font-bold text-lg mb-2">
                                Invest
                            </h4>
                            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                                Invest online via a secure payment gateway or
                                your wallet balance.
                            </p>
                        </div>

                        <div className="hidden lg:block text-slate-300 mb-10">
                            <ChevronRight size={28} />
                        </div>

                        {/* Langkah 3 */}
                        <div className="flex-1 flex flex-col items-center max-w-sm group">
                            <div className="relative mb-6 h-40 w-40 flex items-center justify-center bg-slate-50 rounded-full transition-transform group-hover:scale-105 duration-300">
                                <div className="w-28 h-28 bg-blue-50/60 rounded-full flex items-center justify-center text-[#24608B]">
                                    <TrendingUp size={48} strokeWidth={1.5} />
                                </div>
                                <div className="absolute -top-1 -right-1 bg-[#E0F2FE] text-[#24608B] px-3.5 py-1 rounded-xl text-xs font-bold shadow-sm border border-blue-200">
                                    03. Return
                                </div>
                            </div>
                            <h4 className="text-slate-800 font-bold text-lg mb-2">
                                Earn
                            </h4>
                            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                                Earn short-term returns when the property is
                                sold or the project term ends.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Proyek Section */}
            <div
                id="projects"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                    <div className="text-left">
                        <h3 className="text-2xl font-bold text-slate-800 mb-1">
                            🔥 Active Crowdfunding Projects
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Select top property assets to diversify your
                            capital.
                        </p>
                    </div>
                </div>

                {properties.data.length > 0 ? (
                    <div className="relative w-full px-4 py-6 bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
                        {/* Swiper Container */}
                        <Swiper
                            effect={"coverflow"}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={"auto"}
                            loop={properties.data.length > 3}
                            speed={600}
                            spaceBetween={24}
                            coverflowEffect={{
                                rotate: 0,
                                stretch: 0,
                                depth: 60,
                                modifier: 1.5,
                                slideShadows: false,
                            }}
                            navigation={{
                                nextEl: ".swiper-button-next-custom",
                                prevEl: ".swiper-button-prev-custom",
                            }}
                            modules={[EffectCoverflow, Navigation]}
                            className="w-full py-8"
                        >
                            {properties.data.map((prop, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="!w-[300px] md:!w-[350px] bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl"
                                >
                                    {/* Image Section dengan Badge Status */}
                                    <div className="relative h-48 bg-slate-100 overflow-hidden group">
                                        <img
                                            src={
                                                prop.image ||
                                                `https://placehold.co/600x400?text=${encodeURIComponent(
                                                    prop.name,
                                                )}`
                                            }
                                            alt={prop.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 tracking-wide uppercase border border-slate-200 shadow-sm flex items-center gap-1">
                                            <Building2
                                                size={12}
                                                className="text-blue-600"
                                            />{" "}
                                            Flipping
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-sm font-bold text-slate-800 min-h-[40px] mb-4 line-clamp-2 leading-snug">
                                            {prop.name},{" "}
                                            <span className="text-slate-400 font-normal">
                                                {prop.loc}
                                            </span>
                                        </h3>

                                        {/* Progress Bar Premium Style */}
                                        <div className="mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <div className="flex items-center justify-between text-xs font-semibold mb-2">
                                                <span className="text-slate-500">
                                                    Funds Raised:
                                                </span>
                                                <span className="text-emerald-600 flex items-center gap-1">
                                                    {prop.progress}%
                                                    {prop.progress >= 100 && (
                                                        <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                                                    )}
                                                </span>
                                            </div>

                                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-700"
                                                    style={{
                                                        width: `${Math.min(prop.progress, 100)}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Info Grid (2 Columns, Rapi & Ringkas) */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-xs border-t border-dashed border-slate-100 pt-4 mb-6">
                                            <div>
                                                <span className="text-slate-400 block mb-0.5 font-medium">
                                                    Return (ROI)
                                                </span>
                                                <span className="font-bold text-slate-800 text-sm flex items-center gap-1 text-blue-700">
                                                    {prop.roi} p.a
                                                </span>
                                            </div>

                                            <div>
                                                <span className="text-slate-400 block mb-0.5 font-medium">
                                                    Project Durations
                                                </span>
                                                <span className="font-bold text-slate-800 text-sm">
                                                    {prop.tenor}
                                                </span>
                                            </div>

                                            <div>
                                                <span className="text-slate-400 block mb-0.5 font-medium">
                                                    Funds Raised
                                                </span>
                                                <span className="font-bold text-slate-800">
                                                    {new Intl.NumberFormat(
                                                        "id-ID",
                                                        {
                                                            style: "currency",
                                                            currency: "IDR",
                                                            minimumFractionDigits: 0,
                                                        },
                                                    ).format(prop.collected)}
                                                </span>
                                            </div>

                                            <div>
                                                <span className="text-slate-400 block mb-0.5 font-medium">
                                                    Target
                                                </span>
                                                <span className="font-bold text-slate-800">
                                                    {new Intl.NumberFormat(
                                                        "id-ID",
                                                        {
                                                            style: "currency",
                                                            currency: "IDR",
                                                            minimumFractionDigits: 0,
                                                        },
                                                    ).format(prop.goal)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Premium Action Button */}
                                        <Link
                                            href={route(
                                                "crowdfunding.show",
                                                prop.crowdfunding_id,
                                            )}
                                            className="mt-auto w-full text-center bg-[#24608B]/5 text-[#24608B] hover:bg-[#24608B] hover:text-white font-bold py-2.5 rounded-xl transition-all duration-200 text-xs tracking-wide"
                                        >
                                            Project Details
                                        </Link>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Navigation Buttons */}
                        <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white hover:bg-slate-50 text-slate-700 rounded-full flex items-center justify-center shadow-md border border-slate-200/60 transition-all active:scale-95">
                            <ChevronLeft size={20} strokeWidth={2.5} />
                        </button>

                        <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white hover:bg-slate-50 text-slate-700 rounded-full flex items-center justify-center shadow-md border border-slate-200/60 transition-all active:scale-95">
                            <ChevronRight size={20} strokeWidth={2.5} />
                        </button>

                        {/* Bottom View All */}
                        <div className="mt-6 flex justify-center relative z-10">
                            <Link
                                href={route("crowdfunding.project")}
                                className="bg-[#24608B] hover:bg-[#1d4d70] text-white px-8 py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md"
                            >
                                View All Projects
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 py-16 px-4 text-slate-400 text-sm">
                        Saat ini belum ada proyek crowdfunding yang tersedia.
                        Silakan cek beberapa saat lagi.
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

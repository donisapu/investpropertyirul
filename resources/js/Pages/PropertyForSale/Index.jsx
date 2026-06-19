import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Bed,
    Bath,
    Maximize,
    Building2,
    Search,
    Filter,
    X,
    Gavel,
    PackageSearch,
    ArrowRight,
    ChevronDown,
    MapPin,
    Home,
    Tag,
    BedDouble,
    Maximize2,
    SearchX,
} from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function PropertyForSale({ properties, settings }) {
    const queryParams = new URLSearchParams(window.location.search);
    const [filters, setFilters] = useState({
        search: queryParams.get("search") || "",
        location: queryParams.get("location") || "",
        type: queryParams.get("type") || "",
        bedroom: queryParams.get("bedroom") || "",
        min_price: queryParams.get("min_price") || "",
        max_price: queryParams.get("max_price") || "",
        listing_category: queryParams.get("listing_category") || "",
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        router.get(route("property-for-sale.index"), filters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            location: "",
            type: "",
            bedroom: "",
            min_price: "",
            max_price: "",
        });
        router.get(route("property-for-sale.index"));
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.search !== (queryParams.get("search") || "")) {
                applyFilters();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <PublicLayout>
            <Head title="Property for Sale" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Banner */}
                <div className="relative mb-12 rounded-[2.5rem] overflow-hidden bg-slate-900 border border-slate-800">
                    {/* Ornamen Background Elegan */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="relative px-8 py-16 md:px-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl">
                            {/* Tagline */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                    Aset Eksklusif Tersedia
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                                Marketplace Properti <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                    Pilihan Terbaik
                                </span>
                            </h2>

                            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                                Temukan aset properti pilihan melalui sistem
                                lelang transparan atau titip jual yang aman.
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="#auction"
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/20"
                                >
                                    <Gavel size={18} /> Ikuti Lelang
                                </a>
                                <a
                                    href="#consignment"
                                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-2xl border border-white/10 transition-all"
                                >
                                    <PackageSearch size={18} /> Lihat Properti
                                    Dijual
                                </a>
                            </div>
                        </div>

                        {/* Visual Kanan - Upgrade dari Ikon Basi */}
                        <div className="hidden md:flex flex-col gap-4">
                            {/* Card dengan Background Gambar */}
                            <div className="w-[320px] h-[320px] rounded-[2rem] p-8 flex flex-col justify-between shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 relative overflow-hidden group">
                                {/* 1. LAYER GAMBAR (Jadi Background) */}
                                <img
                                    src="/assets/img/sell.svg"
                                    alt="Auction Illustration"
                                    className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* 2. LAYER OVERLAY (Biar teks tetep kebaca) */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10"></div>

                                {/* 3. LAYER TEKS & KONTEN (Posisinya harus di atas overlay z-20) */}
                                <div className="relative z-20 flex flex-col justify-between h-full">
                                    {/* Ikon Gavel kalo masih mau dipasang sebagai aksen kecil */}
                                    <Gavel
                                        size={32}
                                        className="text-white/50"
                                    />

                                    <div>
                                        <div className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">
                                            Live Auction
                                        </div>
                                        <div className="text-white text-2xl font-black leading-tight">
                                            Sistem Lelang Terbuka
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-12 bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    {/* Header Filter */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#24608B]">
                                <Filter size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 leading-tight">
                                    Pencarian Spesifik
                                </h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    Saring Properti Impian Anda
                                </p>
                            </div>
                        </div>

                        {/* Kontrol Kanan (Desktop & Mobile) */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={clearFilters}
                                className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50"
                            >
                                <X size={14} strokeWidth={3} /> Reset Filter
                            </button>
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="md:hidden flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold text-[#24608B] border border-slate-200"
                            >
                                {isFilterOpen ? "Tutup" : "Buka Filter"}
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Form Container dengan Transisi Halus (Mobile Toggle) */}
                    <div
                        className={`grid gap-6 transition-all duration-300 ease-in-out ${isFilterOpen ? "grid-rows-[1fr] opacity-100 mt-0" : "grid-rows-[0fr] opacity-0 md:grid-rows-[1fr] md:opacity-100 -mt-4 md:mt-0"}`}
                    >
                        <div className="overflow-hidden">
                            {/* Grid Form Utama */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {/* 1. Pencarian Kata Kunci */}
                                <div className="lg:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                                        Kata Kunci
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#24608B]">
                                            <Search size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="search"
                                            value={filters.search}
                                            onChange={handleFilterChange}
                                            placeholder="Cari nama atau deskripsi..."
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-[#24608B] focus:ring-4 focus:ring-blue-50"
                                        />
                                    </div>
                                </div>

                                {/* 2. Lokasi */}
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                                        Area / Kota
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#24608B]">
                                            <MapPin size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="location"
                                            value={filters.location}
                                            onChange={handleFilterChange}
                                            placeholder="Semua Lokasi"
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-[#24608B] focus:ring-4 focus:ring-blue-50"
                                        />
                                    </div>
                                </div>

                                {/* 3. Tipe Properti */}
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                                        Jenis Properti
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#24608B]">
                                            <Home size={18} />
                                        </div>
                                        <select
                                            name="type"
                                            value={filters.type}
                                            onChange={handleFilterChange}
                                            className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 appearance-none outline-none transition-all focus:bg-white focus:border-[#24608B] focus:ring-4 focus:ring-blue-50 cursor-pointer"
                                        >
                                            <option value="">Semua Tipe</option>
                                            <option value="Villa">
                                                Villa / Resort
                                            </option>
                                            <option value="Apartment">
                                                Apartemen
                                            </option>
                                            <option value="House">Rumah</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Baris Kedua: Harga & Kategori */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 border-dashed">
                                {/* Harga Minimum */}
                                <div className="relative group">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                                        Harga Minimum
                                    </label>
                                    <div className="absolute bottom-3.5 left-4 pointer-events-none text-slate-400 font-bold text-xs group-focus-within:text-[#24608B]">
                                        Rp
                                    </div>
                                    <input
                                        type="number"
                                        name="min_price"
                                        value={filters.min_price}
                                        onChange={handleFilterChange}
                                        placeholder="0"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 placeholder-slate-300 outline-none transition-all focus:bg-white focus:border-[#24608B]"
                                    />
                                </div>

                                {/* Harga Maksimum */}
                                <div className="relative group">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                                        Harga Maksimum
                                    </label>
                                    <div className="absolute bottom-3.5 left-4 pointer-events-none text-slate-400 font-bold text-xs group-focus-within:text-[#24608B]">
                                        Rp
                                    </div>
                                    <input
                                        type="number"
                                        name="max_price"
                                        value={filters.max_price}
                                        onChange={handleFilterChange}
                                        placeholder="Tak Terhingga"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 placeholder-slate-300 outline-none transition-all focus:bg-white focus:border-[#24608B]"
                                    />
                                </div>

                                {/* Kategori Listing */}
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                                        Metode Transaksi
                                    </label>
                                    <div className="relative group">
                                        {/* Ikon Kiri - Fixed Vertically Centered */}
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#24608B]">
                                            <Tag size={18} />
                                        </div>

                                        <select
                                            name="listing_category"
                                            value={filters.listing_category}
                                            onChange={handleFilterChange}
                                            className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 appearance-none outline-none transition-all focus:bg-white focus:border-[#24608B] cursor-pointer"
                                        >
                                            <option value="">
                                                Semua Metode
                                            </option>
                                            <option value="sale">
                                                Jual Langsung (Direct)
                                            </option>
                                            <option value="auction">
                                                Lelang (Auction)
                                            </option>
                                        </select>

                                        {/* Ikon Kanan - Fixed Vertically Centered */}
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Aksi Bawah */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                                {/* Reset button untuk mobile (tampil lebar) */}
                                <button
                                    onClick={clearFilters}
                                    className="md:hidden w-full py-3.5 rounded-xl text-sm font-bold text-rose-500 bg-rose-50 border border-rose-100 flex items-center justify-center gap-2"
                                >
                                    <X size={16} strokeWidth={2.5} /> Reset
                                    Semua
                                </button>

                                <button
                                    onClick={applyFilters}
                                    className="w-full bg-slate-900 hover:bg-[#24608B] text-white font-black py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-900/20 flex items-center justify-center gap-2 text-sm tracking-wide"
                                >
                                    <Search size={16} strokeWidth={2.5} />{" "}
                                    Terapkan Filter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {properties.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.data.map((prop, index) => {
                            const isAuction =
                                prop.listing_category === "auction";

                            return (
                                <div
                                    key={index}
                                    className={`bg-white rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 transition-all duration-500 hover:-translate-y-1.5 flex flex-col group overflow-hidden ${
                                        isAuction
                                            ? "hover:border-rose-400 hover:shadow-[0_20px_50px_rgba(244,63,94,0.15)] border-transparent"
                                            : "hover:border-[#24608B] hover:shadow-[0_20px_50px_rgba(36,96,139,0.12)] border-slate-100"
                                    }`}
                                >
                                    {/* Image Section */}
                                    <div className="relative h-64 bg-slate-100 overflow-hidden">
                                        <img
                                            src={
                                                prop.image ||
                                                `https://placehold.co/600x400?text=${encodeURIComponent(prop.name)}`
                                            }
                                            alt={prop.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Overlay Gradient Elegan */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

                                        {/* Badge Tipe Listing (Dinamis Warnanya) */}
                                        <div
                                            className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md ${
                                                isAuction
                                                    ? "bg-rose-500/90 text-white border border-rose-400"
                                                    : "bg-white/90 text-[#24608B] border border-white/50"
                                            }`}
                                        >
                                            {isAuction ? (
                                                <Gavel size={12} />
                                            ) : (
                                                <Tag size={12} />
                                            )}
                                            {isAuction
                                                ? "Lelang Terbuka"
                                                : "Jual Langsung"}
                                        </div>

                                        {/* Harga (Dipindah ke dalam gambar biar ala Airbnb) */}
                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block mb-0.5 shadow-sm">
                                                    {isAuction
                                                        ? "Harga Buka Lelang"
                                                        : "Harga Jual"}
                                                </span>
                                                <span className="text-white font-black text-2xl drop-shadow-md">
                                                    {formatCurrency(prop.price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6 md:p-8 flex-1 flex flex-col bg-white">
                                        {/* Title & Location */}
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">
                                                    {prop.type}
                                                </span>
                                                <span className="text-xs font-bold text-slate-500 border-l border-slate-300 pl-2">
                                                    {prop.ownership}{" "}
                                                    {prop.ownership ===
                                                        "Leasehold" &&
                                                        `• ${prop.lease_term} Thn`}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-extrabold text-slate-900 leading-tight mb-2 group-hover:text-[#24608B] transition-colors line-clamp-1">
                                                {prop.name}
                                            </h3>

                                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                                                <MapPin
                                                    size={14}
                                                    className="text-rose-500"
                                                />{" "}
                                                {prop.loc}
                                            </div>
                                        </div>

                                        {/* Spesifikasi (Lebih Clean tanpa border kotak-kotak) */}
                                        <div className="flex items-center justify-between py-5 border-t border-dashed border-slate-200 mb-6 mt-auto">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <BedDouble size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">
                                                    {prop.specs.bedroom}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <Bath size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">
                                                    {prop.specs.bathroom}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <Maximize2 size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">
                                                    {prop.specs.area}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Button (Dinamis sesuai tipe) */}
                                        <Link
                                            href={
                                                isAuction
                                                    ? route(
                                                          "auctions.show",
                                                          prop.listing_id,
                                                      )
                                                    : route(
                                                          "property-for-sale.show",
                                                          prop.listing_id,
                                                      )
                                            }
                                            className={`w-full font-black py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                                                isAuction
                                                    ? "bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-100 hover:border-rose-500"
                                                    : "bg-slate-50 hover:bg-[#24608B] text-slate-700 hover:text-white border border-slate-100 hover:border-[#24608B]"
                                            }`}
                                        >
                                            {isAuction
                                                ? "Ikuti Lelang Sekarang"
                                                : "Lihat Detail Properti"}
                                            <ArrowRight
                                                size={16}
                                                className="group-hover/btn:translate-x-1 transition-transform"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State yang Lebih Mewah */
                    <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200 shadow-sm">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 relative">
                            <SearchX
                                size={40}
                                className="text-slate-300 relative z-10"
                            />
                            <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50"></div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">
                            Properti Tidak Ditemukan
                        </h3>
                        <p className="text-slate-500 mb-8 max-w-md">
                            Kami tidak menemukan properti yang cocok dengan
                            filter pencarian Anda saat ini. Coba sesuaikan ulang
                            spesifikasi yang dicari.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-[#24608B] transition-all shadow-lg hover:shadow-blue-900/20 hover:-translate-y-0.5"
                        >
                            Reset Semua Filter
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {properties.links && properties.links.length > 3 && (
                    <div className="mt-16 flex flex-wrap justify-center gap-2">
                        {properties.links.map((link, index) => {
                            let label = link.label
                                .replace("&laquo; Previous", "Prev")
                                .replace("Next &raquo;", "Next");

                            return link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-5 py-2.5 min-w-[2.5rem] flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                                        link.active
                                            ? "bg-[#24608B] text-white shadow-md shadow-blue-900/20 scale-105"
                                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 hover:-translate-y-0.5"
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: label }}
                                />
                            ) : (
                                <span
                                    key={index}
                                    className="px-5 py-2.5 min-w-[2.5rem] flex items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400 text-xs font-bold opacity-50 cursor-not-allowed"
                                    dangerouslySetInnerHTML={{ __html: label }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

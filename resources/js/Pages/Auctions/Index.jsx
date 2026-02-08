import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Bed, Bath, Maximize, Gavel, Calendar, MapPin } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Auctions({ auctions }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <PublicLayout>
            <Head title="Lelang & Cessie" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Cessie & Auction Info Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-12">
                    <div className="text-center mb-10">
                        <span className="bg-yellow-300 text-slate-900 font-bold px-4 py-1.5 rounded-full text-lg">
                            Situs Lelang / Cessie
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Apa Itu Cessie */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-center mb-6">APA ITU CESSIE ?</h2>
                            <p className="text-slate-700 leading-relaxed text-justify">
                                Menurut Pasal 613 Kitab Undang-Undang Hukum Perdata (KUHPerdata), istilah
                                cessie digambarkan sebagai pengalihan piutang atas nama oleh kreditur kepada
                                orang lain, sehingga orang tersebut memperoleh hak untuk menagihnya.
                            </p>
                            <p className="text-slate-700 leading-relaxed text-justify">
                                Secara sederhana, cessie dapat diartikan sebagai penggantian orang yang
                                berpiutang lama dengan seseorang berpiutang baru.
                            </p>
                        </div>

                        {/* Divider for mobile/desktop */}
                        <div className="hidden md:block w-px bg-slate-200 absolute left-1/2 h-64 mt-12"></div>

                        {/* Lelang Properti */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-center mb-6">LELANG PROPERTI</h2>
                            <p className="text-slate-700 leading-relaxed text-justify">
                                Selamat datang di platform resmi lelang properti pilihan kami. Kami menghadirkan
                                mekanisme penjualan properti secara transparan, akuntabel, dan dilindungi hukum.
                            </p>
                            <p className="text-slate-700 leading-relaxed text-justify">
                                Anda mencari peluang investasi properti dengan potensi keuntungan maksimal?
                                Kami menyajikan portofolio properti pilihan yang dijual melalui lelang terbuka dan
                                Dokumen yang Legal.
                            </p>
                            <p className="text-slate-700 leading-relaxed text-justify">
                                Manfaatkan harga limit yang menarik dan kami memastikan Anda, sebagai calon pembeli,
                                mendapatkan kepastian hak penuh atas properti terbaik.
                                Platform kami menjamin proses lelang yang bersih (clean) dan sah secara hukum.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Auction Listings */}
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Auctions</h2>
                
                {auctions.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {auctions.data.map((auction) => (
                            <Link 
                                href={route('auctions.show', auction.id)} 
                                key={auction.id} 
                                className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative h-48 bg-slate-200 overflow-hidden">
                                    <img 
                                        src={auction.property?.images?.[0]?.image_url || `https://placehold.co/600x400?text=${encodeURIComponent(auction.property?.property_name || 'Property')}`} 
                                        alt={auction.property?.property_name} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-slate-700 flex items-center gap-1">
                                        <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                        {auction.property?.property_location}
                                    </div>

                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        <div className={`backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-white uppercase self-start ${
                                            auction.type === 'cessie' ? 'bg-yellow-500/90' : 'bg-red-600/90'
                                        }`}>
                                            {auction.type}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">
                                        {auction.property?.property_name}
                                    </h3>
                                    
                                    {/* Location */}
                                    <div className="flex items-center text-slate-500 text-sm mb-3">
                                        <MapPin className="w-4 h-4 mr-1 text-emerald-600 flex-shrink-0" />
                                        <span className="truncate">{auction.property?.property_location}</span>
                                    </div>
                                    
                                    {/* Specs */}
                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Bed className="w-4 h-4 text-emerald-600" />
                                            <span>{auction.property?.bedroom}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Bath className="w-4 h-4 text-emerald-600" />
                                            <span>{auction.property?.bathroom}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Maximize className="w-4 h-4 text-emerald-600" />
                                            <span>{auction.property?.land_area}m²</span>
                                        </div>
                                    </div>

                                    {/* Auction Details */}
                                    <div className="mt-auto border-t border-slate-100 pt-4 space-y-3">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Open Bid</p>
                                            <p className="text-lg font-bold text-emerald-700">
                                                {formatCurrency(auction.open_bid)}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(auction.date_start).toLocaleDateString('id-ID')}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <Gavel className="w-4 h-4" />
                                                <span>Bid inc. {formatCurrency(auction.bid_increment)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <Gavel className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No Auctions Available</h3>
                        <p className="text-slate-500">Check back later for new property auctions.</p>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-12 flex justify-center gap-2">
                    {auctions.links.map((link, index) => (
                        link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                className={`min-w-[2.25rem] h-9 px-3 flex items-center justify-center rounded text-sm transition-colors ${
                                    link.active
                                        ? 'bg-blue-800 text-white font-medium shadow-md shadow-blue-900/20'
                                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span
                                key={index}
                                className="min-w-[2.25rem] h-9 px-3 flex items-center justify-center rounded border border-slate-200 text-slate-400 text-sm"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}

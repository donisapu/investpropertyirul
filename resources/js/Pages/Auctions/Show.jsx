import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Bed, Bath, Maximize, MapPin, ChevronRight, ChevronLeft, Gavel, Calendar, Banknote, X, CheckCircle, Clock, Building2, Home, TrendingUp, Target, FileText, Download } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Show({ auction }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');

    const property = auction.property;

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'unset';
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => 
            prev === (property.images?.length || 0) - 1 ? 0 : prev + 1
        );
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => 
            prev === 0 ? (property.images?.length || 0) - 1 : prev - 1
        );
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage(e);
            if (e.key === 'ArrowLeft') prevImage(e);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    // Use property images or fallback if empty
    const displayImages = property.images && property.images.length > 0 
        ? property.images.map(img => img.image_url)
        : [`https://placehold.co/800x600?text=${encodeURIComponent(property.property_name)}`];

    return (
        <PublicLayout>
            <Head title={property.property_name} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-slate-500 mb-6">
                    <Link href="/auctions" className="hover:text-emerald-600">Lelang/Cessie</Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-slate-900 font-medium">{property.property_name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Gallery Section */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                            <div className="grid grid-cols-4 gap-4 h-[400px]">
                                <div 
                                    className={`h-full relative group cursor-pointer overflow-hidden rounded-xl ${
                                        displayImages.length === 1 ? 'col-span-4' : 'col-span-3'
                                    }`}
                                    onClick={() => openLightbox(0)}
                                >
                                    <img
                                        src={displayImages[0]}
                                        alt={property.property_name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                                {displayImages.length > 1 && (
                                    <div className="col-span-1 grid grid-rows-3 gap-4 h-full">
                                        {displayImages.slice(1, 4).map((img, idx) => (
                                            <div 
                                                key={idx} 
                                                className="h-full relative group cursor-pointer overflow-hidden rounded-xl"
                                                onClick={() => openLightbox(idx + 1)}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`${property.property_name} ${idx + 2}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                {idx === 2 && displayImages.length > 4 && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                                                        +{displayImages.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 mb-2">{property.property_name}</h1>
                                    <div className="flex items-center text-slate-500 text-sm">
                                        <MapPin className="w-4 h-4 mr-1 text-emerald-600" />
                                        {property.property_location}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                        auction.status === 'running' ? 'bg-emerald-100 text-emerald-700' :
                                        auction.status === 'finished' ? 'bg-slate-100 text-slate-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {auction.status}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                        auction.type === 'cessie' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {auction.type}
                                    </span>
                                </div>
                            </div>

                            {/* Key Specs */}
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-6 py-6 border-y border-slate-100 mb-8">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Bed className="w-5 h-5 text-emerald-600" />
                                        <span className="text-xl font-bold text-slate-900">{property.bedroom}</span>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Bedroom</span>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Bath className="w-5 h-5 text-emerald-600" />
                                        <span className="text-xl font-bold text-slate-900">{property.bathroom}</span>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Bathroom</span>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Maximize className="w-5 h-5 text-emerald-600" />
                                        <span className="text-xl font-bold text-slate-900">{property.land_area}m²</span>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Land Area</span>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Building2 className="w-5 h-5 text-emerald-600" />
                                        <span className="text-xl font-bold text-slate-900">{property.building_area}m²</span>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Build Area</span>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Home className="w-5 h-5 text-emerald-600" />
                                        <span className="text-lg font-bold text-slate-900 truncate max-w-[80px]">{property.property_type}</span>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Type</span>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="border-b border-slate-200 mb-6">
                                <div className="flex space-x-8 overflow-x-auto no-scrollbar">
                                    {['overview', 'financials', 'market', 'documents'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pb-4 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${
                                                activeTab === tab
                                                    ? 'border-emerald-600 text-emerald-600'
                                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[300px]">
                                {activeTab === 'overview' && (
                                    <div className="space-y-8">
                                        <div className="prose prose-slate max-w-none">
                                            <h3 className="text-lg font-bold text-slate-900 mb-4">Description</h3>
                                            <div dangerouslySetInnerHTML={{ __html: property.detail }} />
                                        </div>
                                        
                                        {property.timeline && (
                                            <div className="prose prose-slate max-w-none">
                                                <h3 className="text-lg font-bold text-slate-900 mb-4">Project Timeline</h3>
                                                <div dangerouslySetInnerHTML={{ __html: property.timeline }} />
                                            </div>
                                        )}

                                        {property.map_url && (
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-4">Location</h3>
                                                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                                                    <iframe 
                                                        src={property.map_url} 
                                                        width="100%" 
                                                        height="100%" 
                                                        style={{ border: 0 }} 
                                                        allowFullScreen="" 
                                                        loading="lazy" 
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'financials' && (
                                    <div className="space-y-6">
                                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                                                    <Banknote className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Financial Analysis</h3>
                                                    {property.financial ? (
                                                        <div className="prose prose-slate prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: property.financial }} />
                                                    ) : (
                                                        <p className="text-slate-500 italic">No financial details available.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'market' && (
                                    <div className="space-y-6">
                                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                                    <TrendingUp className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Market Analysis</h3>
                                                    {property.market ? (
                                                        <div className="prose prose-slate prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: property.market }} />
                                                    ) : (
                                                        <p className="text-slate-500 italic">No market analysis available.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'documents' && (
                                    <div className="space-y-4">
                                        {property.documents && property.documents.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {property.documents.map((doc, index) => (
                                                    <a 
                                                        key={index}
                                                        href={doc.document_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group bg-white"
                                                    >
                                                        <div className="p-3 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors mr-4">
                                                            <FileText className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-slate-900 truncate">{doc.document_name}</p>
                                                            <p className="text-xs text-slate-500">Click to view</p>
                                                        </div>
                                                        <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                                <p className="text-slate-500">No documents available for this property.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Auction Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                            <div className="p-6 bg-slate-900 text-white">
                                <h3 className="font-bold text-lg mb-1 capitalize">{auction.type} Details</h3>
                                <p className="text-slate-300 text-sm">Participate in this property {auction.type}</p>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Open Bid</p>
                                    <p className="text-3xl font-bold text-emerald-600">
                                        {formatCurrency(auction.open_bid)}
                                    </p>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Gavel className="w-4 h-4" />
                                            <span className="text-sm font-medium">Bid Increment</span>
                                        </div>
                                        <span className="font-bold text-slate-900">{formatCurrency(auction.bid_increment)}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm font-medium">Start Date</span>
                                        </div>
                                        <span className="font-bold text-slate-900">{new Date(auction.date_start).toLocaleDateString('id-ID')}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm font-medium">End Date</span>
                                        </div>
                                        <span className="font-bold text-slate-900">{new Date(auction.date_finish).toLocaleDateString('id-ID')}</span>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                                        Place a Bid
                                    </button>
                                    <p className="text-xs text-center text-slate-500 mt-3">
                                        You need to be logged in to place a bid.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
                    <button 
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    
                    <button 
                        onClick={prevImage}
                        className="absolute left-4 text-white/70 hover:text-white p-2"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>
                    
                    <img 
                        src={displayImages[currentImageIndex]} 
                        alt={property.property_name} 
                        className="max-h-[90vh] max-w-[90vw] object-contain select-none"
                    />
                    
                    <button 
                        onClick={nextImage}
                        className="absolute right-4 text-white/70 hover:text-white p-2"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 font-medium">
                        {currentImageIndex + 1} / {displayImages.length}
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}

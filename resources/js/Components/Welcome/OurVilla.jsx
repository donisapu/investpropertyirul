import { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function OurVilla({ villa }) {
    const imgs = [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1658280024253-34cafdfbb002?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1280&auto=format&fit=crop'
    ];

    const [i, setI] = useState(0);
    const [width, setWidth] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [deltaX, setDeltaX] = useState(0);
    const trackRef = useRef(null);

    const updateWidth = () => {
        if (trackRef.current) {
            setWidth(trackRef.current.getBoundingClientRect().width);
        }
    };

    useEffect(() => {
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const go = (n) => {
        const len = imgs.length;
        setI((n + len) % len);
    };

    const prev = () => go(i - 1);
    const next = () => go(i + 1);

    const start = (e) => {
        setDragging(true);
        setStartX(e.touches ? e.touches[0].clientX : e.clientX);
        setDeltaX(0);
        updateWidth();
    };

    const move = (e) => {
        if (!dragging) return;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        setDeltaX(x - startX);
    };

    const end = () => {
        if (!dragging) return;
        const t = width * 0.15;
        if (deltaX > t) prev();
        else if (deltaX < -t) next();
        setDragging(false);
        setDeltaX(0);
    };

    return (
        <section id="our-villa" className="bg-white relative text-slate-900">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
                <h2 className="text-center text-2xl sm:text-3xl font-semibold tracking-wide uppercase">Our Villa Designs Development</h2>

                {/* Carousel */}
                <div className="mt-6">
                    <div
                        ref={trackRef}
                        className="relative overflow-hidden rounded-md select-none touch-pan-x"
                        onMouseDown={start}
                        onMouseMove={move}
                        onMouseUp={end}
                        onMouseLeave={end}
                        onTouchStart={start}
                        onTouchMove={move}
                        onTouchEnd={end}
                    >
                        <div
                            className="flex w-full"
                            style={{
                                transform: `translateX(calc(${-i * 100}% + ${dragging ? (deltaX / width * 100) : 0}%))`,
                                transition: dragging ? 'none' : 'transform 300ms ease'
                            }}
                        >
                            {imgs.map((src, idx) => (
                                <img key={idx} src={src} alt="" className="w-full shrink-0 aspect-[16/6] object-cover" />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 text-slate-900 shadow hover:bg-white"
                        >
                            <svg className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 4.21a1 1 0 010 1.42L9.42 9l3.37 3.37a1 1 0 11-1.42 1.42l-4.08-4.09a1 1 0 010-1.42l4.08-4.09a1 1 0 011.42 0z" clipRule="evenodd"/></svg>
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 text-slate-900 shadow hover:bg-white"
                        >
                            <svg className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.21 15.79a1 1 0 010-1.42L10.58 11 7.21 7.63a1 1 0 111.42-1.42l4.08 4.09a1 1 0 010 1.42l-4.08 4.09a1 1 0 01-1.42 0z" clipRule="evenodd"/></svg>
                        </button>

                        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
                            {imgs.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => go(idx)}
                                    className={`h-1.5 w-1.5 rounded-full ${i === idx ? 'bg-slate-900' : 'bg-slate-400'}`}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-20 grid gap-8 md:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] items-start">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-semibold uppercase">Nusa Dua Ocean Breeze</h3>
                        <p className="mt-3 text-sm leading-relaxed text-slate-700">
                            A peaceful villa complex nestled in the heart of Nusa Dua, Bali. Our thoughtfully designed one- and two-bedroom villas offer a perfect blend of modern amenities and Bali’s natural surroundings. It offers a comfortable and serene living experience.
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-slate-700">
                            <li className="flex items-start gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Topology: Villa Complex with 1–2 Bedrooms</span></li>
                            <li className="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Land Size: 2500m²</span></li>
                            <li className="flex items-start gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Building Size: 83m² & 108m²</span></li>
                            <li className="flex items-start gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Location: Nusa Dua</span></li>
                            <li className="flex items-start gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Status: Design finished & On progress</span></li>
                        </ul>

                        {villa ? (
                            <a href={route('property.show', { property: villa.id })} className="mt-6 inline-flex items-center rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-900 hover:text-white transition">
                                Details
                                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10 10.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </a>
                        ) : (
                            <a href={route('villa.show', { slug: 'nusa-dua-penida' })} className="mt-6 inline-flex items-center rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-900 hover:text-white transition">
                                Details
                                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10 10.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </a>
                        )}
                    </div>

                    <div className="rounded-md overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1280&auto=format&fit=crop" alt="Nusa Dua Ocean Breeze" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
}

import { useEffect, useRef, useState } from "react";

/*
 * Mengungkap elemen saat pertama kali masuk viewport.
 *
 * Mengembalikan ref dan className, bukan komponen pembungkus, supaya
 * dipasang langsung pada elemen yang sudah ada. Menambah <div> pembungkus
 * akan menggeser tata letak flex dan grid yang sudah diukur.
 *
 * IntersectionObserver dipakai sebagai jalur utama, tetapi TIDAK cukup
 * sendirian: observer hanya memicu ketika sebuah ambang dilintasi. Bila
 * pengguna menggulir sangat cepat atau melompat lewat anchor, elemen
 * pendek bisa berpindah dari bawah layar ke atas layar dalam satu frame.
 * Rasio perpotongannya 0 lalu 0 lagi, tidak ada ambang yang dilintasi,
 * callback tidak pernah berjalan, dan seksi itu tersembunyi selamanya.
 *
 * Karena itu ada penjaga kedua berupa listener scroll pasif yang
 * ber-throttle dengan requestAnimationFrame. Keduanya dilepas begitu
 * elemen tampil, jadi tidak ada listener yang menumpuk.
 */
export default function useReveal({ delay = 0, threshold = 0.08 } = {}) {
    const ref = useRef(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const kurangiGerak = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (kurangiGerak || typeof IntersectionObserver === "undefined") {
            setShown(true);
            return;
        }

        // Sudah terlihat, atau sudah terlewati, saat hook dipasang.
        if (el.getBoundingClientRect().top < window.innerHeight) {
            setShown(true);
            return;
        }

        let selesai = false;
        let rafId = null;

        const bersihkan = () => {
            selesai = true;
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };

        const tampilkan = () => {
            if (selesai) return;
            setShown(true);
            bersihkan();
        };

        const periksa = () => {
            rafId = null;
            if (selesai) return;
            if (el.getBoundingClientRect().top < window.innerHeight) {
                tampilkan();
            }
        };

        const onScroll = () => {
            if (rafId || selesai) return;
            rafId = requestAnimationFrame(periksa);
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting ||
                    entry.boundingClientRect.top < window.innerHeight
                ) {
                    tampilkan();
                }
            },
            { threshold, rootMargin: "0px 0px -10% 0px" }
        );

        observer.observe(el);
        window.addEventListener("scroll", onScroll, { passive: true });

        return bersihkan;
    }, [threshold]);

    return {
        ref,
        className: shown ? "reveal reveal-in" : "reveal",
        style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    };
}

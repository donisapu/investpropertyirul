import useReveal from "@/hooks/useReveal";

/*
 * Trusted Partners — seksi tersendiri, mengikuti mockup Figma.
 *
 * Sebelumnya blok ini menumpang di dalam <footer> dengan ground gelap.
 * Mockup memperlakukannya sebagai seksi terang di antara Promo dan Footer:
 * eyebrow, lalu judul kiri + paragraf kanan, lalu barisan logo di tengah.
 */
export default function TrustedPartners({ partners }) {
    const reveal = useReveal();

    if (!partners || partners.length === 0) return null;

    return (
        <section
            ref={reveal.ref}
            aria-labelledby="partner-heading"
            className={`w-full bg-cream-deep text-ink ${reveal.className}`}
        >
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-6 py-14 sm:px-10 lg:px-[72px] lg:py-[60px]">
                <p className="text-[11px] uppercase leading-[17px] tracking-[1.5px] text-gold-ink">
                    Trusted Partners
                </p>

                <div className="flex flex-col gap-4 lg:flex-row lg:gap-20">
                    <h2
                        id="partner-heading"
                        className="flex-1 text-[clamp(1.5rem,3.5vw,2rem)] font-semibold leading-[1.3] text-ink"
                    >
                        Dibangun bersama partner terpercaya.
                    </h2>
                    <p className="max-w-[70ch] flex-1 text-[15px] leading-[23px] text-ink-soft">
                        Kami bekerja sama dengan berbagai entitas terkemuka
                        untuk menghadirkan ekosistem properti yang aman dan
                        terintegrasi.
                    </p>
                </div>

                {/*
                 * Nama mitra ditulis sebagai alt, bukan sekadar dekorasi:
                 * logo yang tidak terbaca tidak membuktikan apa pun. Bila
                 * berkas logonya gagal dimuat, nama mitra tetap terbaca.
                 */}
                <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 py-4 lg:gap-x-[72px]">
                    {partners.map((partner) => (
                        <li
                            key={partner.id}
                            className="flex h-16 w-[100px] items-center justify-center"
                        >
                            <img
                                src={`/storage/${partner.image_url}`}
                                alt={partner.name}
                                title={partner.name}
                                loading="lazy"
                                className="max-h-16 w-auto max-w-[100px] object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

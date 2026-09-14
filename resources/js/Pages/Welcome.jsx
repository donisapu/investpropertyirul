import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";

import Hero from "@/Components/Welcome/Hero";
import Howto from "@/Components/Welcome/Howto";
import OurVilla from "@/Components/Welcome/OurVilla";
import DeveloperProjects from "@/Components/Welcome/DeveloperProjects";
import Calculator from "@/Components/Welcome/Calculator";
import OurLocation from "@/Components/Welcome/OurLocation";

/*
 * Home kini memakai PublicLayout seperti seluruh halaman publik lain.
 * Header, Promo, Trusted Partners, dan Footer disediakan oleh layout,
 * jadi halaman ini hanya berisi seksi khas Home.
 *
 * Manrope dimuat di app.blade.php agar berlaku untuk semua halaman, bukan
 * hanya Home.
 */
export default function Welcome({
    auth,
    villa,
    settings,
    projects,
    landings,
    landmarks,
    sliders,
}) {
    return (
        <PublicLayout>
            <Head title="Investasi Mudah & Aman" />

            <Hero landings={landings} settings={settings} sliders={sliders} />
            <Howto auth={auth} landings={landings} />
            <OurVilla villa={villa} sliders={sliders} landings={landings} />
            <DeveloperProjects project={projects} landings={landings} />
            <Calculator landings={landings} projects={projects} />
            <OurLocation landings={landings} landmarks={landmarks} />
        </PublicLayout>
    );
}

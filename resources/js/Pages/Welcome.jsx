import { Head } from "@inertiajs/react";
import Header from "@/Components/Welcome/Header";
import Hero from "@/Components/Welcome/Hero";
import Howto from "@/Components/Welcome/Howto";
import OurVilla from "@/Components/Welcome/OurVilla";
import DeveloperProjects from "@/Components/Welcome/DeveloperProjects";
import Calculator from "@/Components/Welcome/Calculator";
import OurLocation from "@/Components/Welcome/OurLocation";
import Footer from "@/Components/Welcome/Footer";

export default function Welcome({
    auth,
    villa,
    laravelVersion,
    phpVersion,
    settings,
    partners,
    projects,
    landings,
    landmarks,
    sliders,
    campaigns,
}) {
    return (
        <>
            <Head title="Investasi Mudah & Aman">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="font-sans antialiased bg-slate-950">
                <div className="min-h-screen flex flex-col">
                    <Header />

                    <main className="flex-1 text-slate-50">
                        <Hero landings={landings} settings={settings} sliders={sliders} />
                        <Howto auth={auth} landings={landings} />
                        <OurVilla
                            villa={villa}
                            sliders={sliders}
                            landings={landings}
                        />
                        <DeveloperProjects
                            project={projects}
                            landings={landings}
                        />
                        <Calculator landings={landings} projects={projects}/>
                        <OurLocation
                            landings={landings}
                            landmarks={landmarks}
                        />
                    </main>

                    <Footer
                        settings={settings}
                        laravelVersion={laravelVersion}
                        phpVersion={phpVersion}
                        partners={partners}
                        campaigns={campaigns}
                    />
                </div>
            </div>
        </>
    );
}

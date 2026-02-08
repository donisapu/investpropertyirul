import { Head } from '@inertiajs/react';
import Header from '@/Components/Welcome/Header';
import Hero from '@/Components/Welcome/Hero';
import OurVilla from '@/Components/Welcome/OurVilla';
import DeveloperProjects from '@/Components/Welcome/DeveloperProjects';
import OurLocation from '@/Components/Welcome/OurLocation';
import Footer from '@/Components/Welcome/Footer';

export default function Welcome({ auth, villa, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="InvestProperti">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />
            </Head>
            
            <div className="font-sans antialiased bg-slate-950">
                <div className="min-h-screen flex flex-col">
                    <Header />

                    <main className="flex-1 text-slate-50">
                        <Hero />
                        <OurVilla villa={villa} />
                        <DeveloperProjects />
                        <OurLocation />
                    </main>

                    <Footer laravelVersion={laravelVersion} phpVersion={phpVersion} />
                </div>
            </div>
        </>
    );
}

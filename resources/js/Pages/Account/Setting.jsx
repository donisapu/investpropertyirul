import React from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { User, Phone, Mail, Lock, Save, ShieldCheck } from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function AccountSettings() {
    // Mengambil data user yang sedang login dari props Inertia
    const { auth } = usePage().props;
    const user = auth?.user || {};

    // Form state untuk update profil
    const profileForm = useForm({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
    });

    // Form state untuk update password
    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.put(route("profile.update"), {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <PublicLayout>
            <Head title="Pengaturan Akun" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Banner Header */}
                <div className="relative mb-10 rounded-[2.5rem] overflow-hidden bg-ink border border-white/10 p-8 md:p-10">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold/20 rounded-full blur-[90px] pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-3 border border-white/10">
                            <User size={14} className="text-gold" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                Manajemen Profil
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Pengaturan{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-ink">
                                Akun
                            </span>
                        </h1>
                        <p className="text-cream/75 text-sm mt-2">
                            Kelola informasi pribadi, identitas diri, dan
                            keamanan kata sandi akun kamu.
                        </p>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Sidebar Menu / Brief User Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-cream rounded-[2.5rem] border border-gold-line p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                            <div className="w-20 h-20 rounded-full bg-ink text-gold flex items-center justify-center font-black text-2xl mx-auto mb-4 border-2 border-gold shadow-md">
                                {user.name
                                    ? user.name.charAt(0).toUpperCase()
                                    : "U"}
                            </div>
                            <h3 className="font-black text-ink text-lg">
                                {user.name || "Pengguna"}
                            </h3>
                            <p className="text-xs font-bold text-ink-soft mt-1">
                                {user.email || "email@domain.com"}
                            </p>

                            <div className="mt-6 pt-6 border-t border-dashed border-gold-line flex items-center justify-center gap-2">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                                    <ShieldCheck size={14} /> Terverifikasi
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form Content Area */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Informasi Profil */}
                        <div className="bg-cream rounded-[2.5rem] border border-gold-line p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                            <div className="border-b border-dashed border-gold-line pb-4 mb-6">
                                <h3 className="text-xl font-black text-ink">
                                    Informasi Pribadi
                                </h3>
                                <p className="text-xs font-bold text-ink-soft uppercase tracking-wider mt-1">
                                    Perbarui nama dan nomor telepon aktif kamu
                                </p>
                            </div>

                            <form
                                onSubmit={handleProfileSubmit}
                                className="space-y-5"
                            >
                                {/* Field Nama */}
                                <div>
                                    <label className="block text-xs font-black text-ink uppercase tracking-wider mb-2">
                                        Nama Lengkap
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-soft">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={profileForm.data.name}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    "name",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Masukkan nama lengkap"
                                            className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border border-gold-line text-ink font-bold text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                            required
                                        />
                                    </div>
                                    {profileForm.errors.name && (
                                        <p className="text-xs font-bold text-rose-600 mt-1.5">
                                            {profileForm.errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Field Phone */}
                                <div>
                                    <label className="block text-xs font-black text-ink uppercase tracking-wider mb-2">
                                        Nomor Telepon / WhatsApp
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-soft">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={profileForm.data.phone}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    "phone",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: 081234567890"
                                            className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border border-gold-line text-ink font-bold text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                        />
                                    </div>
                                    {profileForm.errors.phone && (
                                        <p className="text-xs font-bold text-rose-600 mt-1.5">
                                            {profileForm.errors.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Field Email (Disabled/Read-only) */}
                                <div>
                                    <label className="block text-xs font-black text-ink-soft uppercase tracking-wider mb-2">
                                        Alamat Email (Tidak Dapat Diubah)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-soft">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={profileForm.data.email}
                                            disabled
                                            className="w-full pl-11 pr-4 py-3.5 bg-cream-deep/60 rounded-2xl border border-gold-line text-ink-soft font-bold text-sm cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="pt-3">
                                    <button
                                        type="submit"
                                        disabled={profileForm.processing}
                                        className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-ink px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
                                    >
                                        <Save size={16} /> Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Keamanan Kata Sandi */}
                        <div className="bg-cream rounded-[2.5rem] border border-gold-line p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                            <div className="border-b border-dashed border-gold-line pb-4 mb-6">
                                <h3 className="text-xl font-black text-ink">
                                    Ubah Kata Sandi
                                </h3>
                                <p className="text-xs font-bold text-ink-soft uppercase tracking-wider mt-1">
                                    Pastikan kata sandi kamu menggunakan
                                    kombinasi yang aman
                                </p>
                            </div>

                            <form
                                onSubmit={handlePasswordSubmit}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="block text-xs font-black text-ink uppercase tracking-wider mb-2">
                                        Kata Sandi Saat Ini
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-soft">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            value={
                                                passwordForm.data
                                                    .current_password
                                            }
                                            onChange={(e) =>
                                                passwordForm.setData(
                                                    "current_password",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border border-gold-line text-ink font-bold text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-ink uppercase tracking-wider mb-2">
                                        Kata Sandi Baru
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-soft">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            value={passwordForm.data.password}
                                            onChange={(e) =>
                                                passwordForm.setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border border-gold-line text-ink font-bold text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-ink uppercase tracking-wider mb-2">
                                        Konfirmasi Kata Sandi Baru
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-soft">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            value={
                                                passwordForm.data
                                                    .password_confirmation
                                            }
                                            onChange={(e) =>
                                                passwordForm.setData(
                                                    "password_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border border-gold-line text-ink font-bold text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-3">
                                    <button
                                        type="submit"
                                        disabled={passwordForm.processing}
                                        className="inline-flex items-center justify-center gap-2 bg-ink hover:bg-ink/90 text-cream px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
                                    >
                                        <Lock size={16} /> Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

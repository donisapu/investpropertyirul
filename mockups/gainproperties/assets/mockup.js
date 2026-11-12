/*
 * Mockup GAIN Properties — aset bersama.
 *
 * Token warna & font disalin dari tailwind.config.js aplikasi supaya
 * mockup terlihat sama dengan situs asli (cream / ink / gold, Manrope).
 *
 * Halaman dengan beberapa keadaan memakai <div id="mockbar" data-states="...">.
 * Elemen dengan data-show="a b" hanya tampil saat state aktif = a atau b.
 * State juga bisa dibuka langsung lewat ?state=nama (untuk screenshot).
 */
tailwind.config = {
    theme: {
        extend: {
            fontFamily: { sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"] },
            colors: {
                cream: { DEFAULT: "#FAF9F6", deep: "#F0EFE9", sink: "#EAE9E0" },
                ink: { DEFAULT: "#242620", soft: "#686A61", faint: "#8C8E84" },
                paper: "#FDFDFB",
                status: {
                    info: "#35577A", "info-bg": "#E2E9F0",
                    success: "#2F6B4F", "success-bg": "#E3EDE5",
                    danger: "#9B3B2E", "danger-bg": "#F4E1DC",
                    warn: "#8A5A12", "warn-bg": "#F5EBD9",
                },
                gold: { DEFAULT: "#C7A45C", ink: "#866020", line: "#DDDCD3", edge: "#C6C8BC" },
            },
        },
    },
};

window.rp = (n) => "Rp " + Math.round(n).toLocaleString("id-ID");

const NAV = [
    ["Home", "index.html", "home"],
    ["Property for Sale", "penjualan.html", "sale"],
    ["Auctions", "lelang.html", "auction"],
];

function renderHeader(active) {
    const links = NAV.map(([label, href, key]) =>
        `<a href="${href}" class="rounded-full px-4 py-2 text-[13px] font-semibold ${key === active ? "bg-cream-deep text-ink" : "text-ink-soft hover:text-ink"}">${label}</a>`
    ).join("");
    const account = ["my-bids", "wallet"].includes(active);
    return `
    <header class="sticky top-0 z-40 border-b border-gold-line bg-cream/95 backdrop-blur">
      <div class="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="index.html" class="flex items-center gap-3">
          <span class="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-ink text-[13px] font-extrabold text-gold">G</span>
          <span class="text-[15px] font-extrabold uppercase tracking-[1.3px] text-ink">Gain Properties</span>
        </a>
        <nav class="hidden items-center gap-1 lg:flex">${links}</nav>
        <div class="flex items-center gap-2">
          <a href="my-bids.html" class="hidden rounded-full px-4 py-2 text-[13px] font-semibold sm:inline ${active === "my-bids" ? "bg-cream-deep text-ink" : "text-ink-soft hover:text-ink"}">My Bids</a>
          <a href="wallet.html" class="hidden rounded-full px-4 py-2 text-[13px] font-semibold sm:inline ${active === "wallet" ? "bg-cream-deep text-ink" : "text-ink-soft hover:text-ink"}">Wallet</a>
          <span class="inline-flex items-center gap-2 rounded-full ${account ? "bg-gold text-ink" : "bg-ink text-cream"} px-4 py-2 text-[13px] font-bold">
            <i data-lucide="user" class="h-4 w-4"></i> Budi S.
          </span>
        </div>
      </div>
    </header>`;
}

function renderFooter() {
    return `
    <footer class="mt-20 border-t border-gold-line bg-ink text-cream/70">
      <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-[12px] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span class="font-bold uppercase tracking-[1.3px] text-cream">Gain Properties</span>
        <span>PT Gemilang Arta Investasi · Kensington Office Tower Lt. 15, Kelapa Gading, Jakarta Utara</span>
      </div>
    </footer>`;
}

function setupStates() {
    const bar = document.getElementById("mockbar");
    if (!bar) return;
    const states = JSON.parse(bar.dataset.states);
    const fromUrl = new URLSearchParams(location.search).get("state");
    const initial = states.some(([k]) => k === fromUrl) ? fromUrl : states[0][0];

    bar.innerHTML = `
      <div class="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-2.5 sm:px-6 lg:px-8">
        <span class="mr-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[1.2px] text-status-info">
          <i data-lucide="layers" class="h-3.5 w-3.5"></i> Mockup · pilih keadaan:
        </span>
        ${states.map(([k, label], i) => `<button data-set="${k}" class="state-btn rounded-full border border-status-info/30 px-3 py-1 text-[12px] font-semibold text-status-info">${i + 1}. ${label}</button>`).join("")}
      </div>`;

    const apply = (state) => {
        document.querySelectorAll("[data-show]").forEach((el) => {
            el.hidden = !el.dataset.show.split(/\s+/).includes(state);
        });
        bar.querySelectorAll(".state-btn").forEach((b) => {
            const on = b.dataset.set === state;
            b.classList.toggle("bg-status-info", on);
            b.classList.toggle("text-white", on);
            b.classList.toggle("text-status-info", !on);
        });
        const url = new URL(location.href);
        url.searchParams.set("state", state);
        history.replaceState(null, "", url);
    };
    bar.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-set]");
        if (btn) apply(btn.dataset.set);
    });
    document.addEventListener("click", (e) => {
        const go = e.target.closest("[data-goto]");
        if (go) { e.preventDefault(); apply(go.dataset.goto); window.scrollTo({ top: 0, behavior: "smooth" }); }
    });
    apply(initial);
}

document.addEventListener("DOMContentLoaded", () => {
    const h = document.getElementById("site-header");
    if (h) h.outerHTML = renderHeader(document.body.dataset.page);
    const f = document.getElementById("site-footer");
    if (f) f.outerHTML = renderFooter();
    document.querySelectorAll("[data-rp]").forEach((el) => (el.textContent = rp(Number(el.dataset.rp))));
    setupStates();
    if (window.lucide) lucide.createIcons();
});

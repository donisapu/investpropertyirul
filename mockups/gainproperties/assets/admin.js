/*
 * Mockup admin GAIN Properties — meniru panel admin yang ada (template Sneat,
 * Bootstrap 5, Public Sans, boxicons) dan pola antrean + detail dari halaman
 * Withdrawals (resources/views/pages/withdrawals/index.blade.php).
 *
 * State switcher sama dengan mockup publik: <div id="mockbar" data-states>,
 * elemen data-show="a b", tombol data-goto="state", dan ?state= di URL.
 */
const ADMIN_MENU = [
    ["Dashboard", "bx-home-circle"],
    ["Xendit Dashboard", "bx-tachometer"],
    { header: "Property" },
    ["Properties", "bx-building-house"],
    { header: "Transactions" },
    ["Withdrawals", "bx-wallet"],
    ["Xendit Transactions", "bx-transfer"],
    ["Company Cash-out", "bx-money-withdraw"],
    { header: "Products" },
    ["Property For Sale", "bx-key", "sale-listing"],
    ["Bookings", "bx-calendar-check", "booking", true],
    ["Auctions", "bx-trophy", "auction", true],
    { header: "Settings" },
    ["Website Setting", "bx-cog"],
    ["Campaign", "bx-purchase-tag"],
];

function renderAdminShell(active) {
    const items = ADMIN_MENU.map((m) => {
        if (m.header) return `<li class="menu-header">${m.header}</li>`;
        const [label, icon, key, isNew] = m;
        const href = key === "booking" ? "admin-booking.html" : key === "auction" ? "admin-lelang.html" : "#";
        return `<li><a href="${href}" class="menu-link ${key === active ? "active" : ""}"><i class="bx ${icon}"></i><span>${label}</span>${isNew ? '<span class="new-pill">baru</span>' : ""}</a></li>`;
    }).join("");
    return `
      <aside class="admin-menu">
        <div class="brand"><span class="brand-logo">G</span><span>GAIN Properties</span></div>
        <ul>${items}</ul>
      </aside>`;
}

function setupAdmin() {
    const page = document.body.dataset.page;
    const shell = document.getElementById("admin-shell");
    if (shell) shell.outerHTML = renderAdminShell(page);

    const bar = document.getElementById("mockbar");
    if (bar) {
        const states = JSON.parse(bar.dataset.states);
        const fromUrl = new URLSearchParams(location.search).get("state");
        const initial = states.some(([k]) => k === fromUrl) ? fromUrl : states[0][0];
        bar.innerHTML = `<span class="mockbar-label"><i class="bx bx-layer"></i> Mockup · pilih keadaan:</span>` +
            states.map(([k, l], i) => `<button data-set="${k}" class="state-btn">${i + 1}. ${l}</button>`).join("");
        const apply = (state) => {
            document.querySelectorAll("[data-show]").forEach((el) => {
                el.hidden = !el.dataset.show.split(/\s+/).includes(state);
            });
            bar.querySelectorAll(".state-btn").forEach((b) => b.classList.toggle("on", b.dataset.set === state));
            // Tab & item antrean ikut aktif: data-on="state1 state2"
            document.querySelectorAll("[data-on]").forEach((el) => {
                el.classList.toggle(el.dataset.onClass || "on", el.dataset.on.split(/\s+/).includes(state));
            });
            const url = new URL(location.href);
            url.searchParams.set("state", state);
            history.replaceState(null, "", url);
        };
        bar.addEventListener("click", (e) => { const b = e.target.closest("[data-set]"); if (b) apply(b.dataset.set); });
        document.addEventListener("click", (e) => {
            const go = e.target.closest("[data-goto]");
            if (go) { e.preventDefault(); apply(go.dataset.goto); window.scrollTo({ top: 0, behavior: "smooth" }); }
        });
        apply(initial);
    }
    document.querySelectorAll("[data-rp]").forEach((el) => (el.textContent = "Rp " + Number(el.dataset.rp).toLocaleString("id-ID")));
}

document.addEventListener("DOMContentLoaded", setupAdmin);

/*
 * Feature flag dari backend (config/features.php), dibagikan lewat
 * HandleInertiaRequests sebagai prop `features`.
 *
 * gainproperties.id hanya menjalankan Penjualan + Lelang; Investment dan
 * Crowdfunding disembunyikan (route-nya 404). Item yang butuh fitur
 * menulis `feature: "investment"` atau `feature: ["investment", "crowdfunding"]`
 * (lolos bila salah satu aktif).
 */
export function isEnabled(features, feature) {
    if (!feature) return true;
    const needed = Array.isArray(feature) ? feature : [feature];
    return needed.some((name) => Boolean(features?.[name]));
}

/** Investasi apa pun (lot atau crowdfunding) sedang aktif. */
export function isInvesting(features) {
    return isEnabled(features, ["investment", "crowdfunding"]);
}

export function visibleItems(items, features) {
    return items.filter((item) => isEnabled(features, item.feature));
}

const TONES = {
    info: "bg-status-info-bg text-status-info",
    success: "bg-status-success-bg text-status-success",
    danger: "bg-status-danger-bg text-status-danger",
    neutral: "bg-cream-deep text-ink-soft",
};

export default function StatusBadge({ status }) {
    if (!status) return null;
    const tone = TONES[status.tone] || TONES.neutral;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold leading-4 whitespace-nowrap ${tone}`}
        >
            <span aria-hidden="true" className="h-[5px] w-[5px] rounded-full bg-current" />
            {status.label}
        </span>
    );
}

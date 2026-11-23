import React from "react";
import { MessageCircle, Users } from "lucide-react";

/**
 * WhatsApp for a buyer who paid (booking fee, auction deposit). `followup` comes from the
 * server ({url, kind: "chat"|"group"}) and is only sent to that buyer; the number, group link
 * and pre-filled text are set by the admin.
 */
export default function FollowUpWhatsApp({ followup, className, label }) {
    if (!followup?.url) return null;
    const group = followup.kind === "group";
    const Icon = group ? Users : MessageCircle;

    return (
        <a href={followup.url} target="_blank" rel="noreferrer" className={className}>
            <Icon size={18} aria-hidden="true" /> {label ?? (group ? "Gabung Grup WhatsApp" : "Lanjut via WhatsApp")}
        </a>
    );
}

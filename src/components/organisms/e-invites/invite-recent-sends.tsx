import type { InviteAudienceRow, InviteCampaignRow } from "@/services/invites.services";
import { useMemo, useState } from "react";

type InviteRecentSendsProps = {
  campaigns: InviteCampaignRow[];
  audiences: InviteAudienceRow[];
  onSendCampaign?: (campaign: InviteCampaignRow) => void;
  sendingCampaignId?: string;
};

const statusLabel = {
  draft: "Draft",
  scheduled: "Scheduled",
  sending: "Sending",
  sent: "Sent",
  failed: "Failed",
} as const;

const statusClass = {
  draft: "bg-evvnt-n100 text-evvnt-n600",
  scheduled: "bg-evvnt-warn-subtle text-evvnt-warn",
  sending: "bg-evvnt-tint text-evvnt-core",
  sent: "bg-evvnt-success-subtle text-evvnt-success",
  failed: "bg-evvnt-danger-subtle text-evvnt-danger",
} as const;

const statusTabs = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "scheduled", label: "Scheduled" },
  { id: "sent", label: "Sent" },
  { id: "failed", label: "Failed" },
] as const;

function formatStats(campaign: InviteCampaignRow) {
  const stats = campaign.stats;
  if (!stats) {
    return "No delivery metrics yet";
  }
  const openRate = stats.delivered > 0 ? Math.round((stats.opened / stats.delivered) * 100) : 0;
  return `${stats.delivered.toLocaleString()} delivered · ${openRate}% opened · ${stats.clicked.toLocaleString()} clicks`;
}

function formatWhen(campaign: InviteCampaignRow) {
  const val = campaign.sentAt ?? campaign.updatedAt ?? campaign.createdAt;
  const date = new Date(val);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function InviteRecentSends({
  campaigns,
  audiences,
  onSendCampaign,
  sendingCampaignId,
}: InviteRecentSendsProps) {
  const [activeTab, setActiveTab] = useState<(typeof statusTabs)[number]["id"]>("all");
  const audienceLabelById = new Map(audiences.map((a) => [a.id, a.label]));
  const visibleCampaigns = useMemo(() => {
    if (activeTab === "all") return campaigns;
    return campaigns.filter((campaign) => campaign.status === activeTab);
  }, [campaigns, activeTab]);

  return (
    <section className="rounded-evvnt-2xl border border-evvnt-n200 bg-white shadow-[0_1px_2px_rgb(26_9_51_/_5%)]">
      <div className="space-y-2 border-b border-evvnt-n100 px-4 py-3.5">
        <h2 className="text-[13px] font-semibold tracking-tight text-evvnt-ink">Recent sends</h2>
        <div className="flex flex-wrap gap-1.5">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? "rounded-full border border-evvnt-muted bg-evvnt-tint px-2.5 py-1 text-[10px] font-semibold text-evvnt-core"
                  : "rounded-full border border-evvnt-n200 px-2.5 py-1 text-[10px] font-medium text-evvnt-n500 hover:border-evvnt-muted"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2.5 p-3.5">
        {visibleCampaigns.length === 0 ? (
          <div className="rounded-evvnt-lg border border-evvnt-n200 bg-evvnt-mist px-3 py-2.5 text-[11px] text-evvnt-n500">
            No invite campaigns yet. Save a draft or send your first invite.
          </div>
        ) : null}
        {visibleCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="rounded-evvnt-lg border border-evvnt-n200 bg-evvnt-mist px-3.5 py-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-evvnt-ink">{campaign.title}</p>
                <p className="mt-0.5 text-[11px] text-evvnt-n500">
                  {audienceLabelById.get(campaign.audienceId) ?? "Unknown audience"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClass[campaign.status]}`}
                >
                  {statusLabel[campaign.status]}
                </span>
                <p className="text-[10px] text-evvnt-n400">{formatWhen(campaign)}</p>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-evvnt-core">{formatStats(campaign)}</p>
            {(campaign.status === "draft" || campaign.status === "failed") && onSendCampaign ? (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => onSendCampaign(campaign)}
                  disabled={sendingCampaignId === campaign.id}
                  className="rounded-evvnt-sm border border-evvnt-muted bg-evvnt-tint px-2.5 py-1 text-[10px] font-semibold text-evvnt-core hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sendingCampaignId === campaign.id
                    ? "Sending..."
                    : campaign.status === "failed"
                      ? "Retry send"
                      : "Send now"}
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

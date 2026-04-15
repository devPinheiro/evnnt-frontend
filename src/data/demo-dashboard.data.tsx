import { Check, Gift, LineChart, Mail, Ticket, Wallet } from "lucide-react";

import type { ActivityRow } from "@organisms/dashboard/activity-feed";
import type { AttentionItem } from "@organisms/dashboard/attention-strip";
import type { EventCardProps } from "@organisms/dashboard/event-card";
import type { KpiItem } from "@organisms/dashboard/kpi-strip";

export const demoKpiItems: KpiItem[] = [
  {
    id: "active",
    label: "Active events",
    value: "3",
    bar: "purple",
    delta: (
      <>
        <span className="text-evvnt-success">↑</span>
        <span className="text-evvnt-n400"> of 5 allowed</span>
      </>
    ),
    target: "Target: 500 platform-wide",
  },
  {
    id: "gmv",
    label: "Tickets GMV",
    value: "₦6.4M",
    bar: "vivid",
    delta: (
      <>
        <span className="text-evvnt-success">↑</span>
        <span className="text-evvnt-n400"> 22% this month</span>
      </>
    ),
    target: "Platform target ₦50M",
  },
  {
    id: "gift",
    label: "Gift volume",
    value: "₦940K",
    bar: "success",
    delta: (
      <>
        <span className="text-evvnt-success">↑</span>
        <span className="text-evvnt-n400"> 3 pending payouts</span>
      </>
    ),
    target: "Platform target ₦20M",
  },
  {
    id: "rsvp",
    label: "RSVP conversion",
    value: "68%",
    bar: "warn",
    accent: false,
    delta: (
      <>
        <span className="text-evvnt-success">↑</span>
        <span className="text-evvnt-n400"> above 60% target</span>
      </>
    ),
    target: "Target: > 60%",
  },
  {
    id: "vendor",
    label: "Vendor via Evvnt Pay",
    value: "44%",
    bar: "soft",
    accent: false,
    delta: (
      <>
        <span className="text-evvnt-success">↑</span>
        <span className="text-evvnt-n400"> above 40% target</span>
      </>
    ),
    target: "Target: > 40%",
  },
  {
    id: "nps",
    label: "NPS score",
    value: "62",
    bar: "deep",
    accent: false,
    delta: (
      <>
        <span className="text-evvnt-success">↑</span>
        <span className="text-evvnt-n400"> above 50 target</span>
      </>
    ),
    target: "Target: > 50",
  },
];

export const demoAttentionItems: AttentionItem[] = [
  {
    id: "a1",
    dotColor: "var(--color-evvnt-danger)",
    title: "Photography budget at 100% — Okonkwo Wedding",
    subtitle: "₦450,000 committed · no headroom remaining · event in 2 days",
    badge: "Over budget",
    badgeVariant: "danger",
    action: "Review →",
  },
  {
    id: "a2",
    dotColor: "var(--color-evvnt-warn)",
    title: "62 guests haven't responded — Okonkwo Wedding",
    subtitle: "RSVP deadline tomorrow · send reminder to non-responders",
    badge: "RSVP due",
    badgeVariant: "warn",
    action: "Send reminder →",
  },
  {
    id: "a3",
    dotColor: "var(--color-evvnt-core)",
    title: "Vendor invoice pending approval — TechNext Lagos",
    subtitle: "AV Solutions Ltd · ₦280,000 final balance · submitted 2h ago",
    badge: "Awaiting you",
    badgeVariant: "purple",
    action: "Approve →",
  },
  {
    id: "a4",
    dotColor: "var(--color-evvnt-success)",
    title: "₦940,000 gift wallet ready for payout",
    subtitle: "Across 2 events · Paystack settlement takes 24–48h",
    badge: "Ready to withdraw",
    badgeVariant: "purple",
    action: "Payout →",
  },
];

export const demoEventCards: EventCardProps[] = [
  {
    title: "The Okonkwo Wedding",
    banner: 1,
    status: "live",
    typeLabel: "Wedding",
    accessLabel: "Public · Ticketed",
    accessVariant: "public",
    dateLine: "Sat 14 Jun 2025 · 12:00 PM",
    locationLine: "Eko Hotel & Suites, Victoria Island",
    featured: true,
    metrics: [
      { label: "Revenue", value: "₦4.2M", accent: true },
      { label: "Tickets", value: "843" },
      { label: "Checked in", value: "247" },
      { label: "Gifts", value: "₦680K", accent: true },
    ],
  },
  {
    title: "TechNext Lagos 2025",
    banner: 2,
    status: "upcoming",
    typeLabel: "Conference",
    accessLabel: "Public · Ticketed",
    accessVariant: "public",
    dateLine: "Fri 4 Jul 2025 · 9:00 AM",
    locationLine: "Radisson Blu, Victoria Island, Lagos",
    metrics: [
      { label: "Revenue", value: "₦2.1M", accent: true },
      { label: "Tickets", value: "420" },
      { label: "RSVP'd", value: "312" },
      { label: "Vendors", value: "6" },
    ],
  },
  {
    title: "Adaeze's 30th Birthday",
    banner: "new",
    status: "draft",
    typeLabel: "Birthday · Owambe",
    accessLabel: "Private",
    accessVariant: "private",
    dateLine: "Sun 20 Jul 2025 · TBC",
    locationLine: "Venue not yet set · Abuja",
    metrics: [
      { label: "Guests", value: "—" },
      { label: "Complete", value: "0%" },
      {
        label: "",
        value: (
          <span className="text-[11px] font-medium text-evvnt-warn">3 steps left to publish</span>
        ),
        span: 2,
      },
    ],
  },
  {
    title: "Kola & Yetunde's Wedding",
    banner: 3,
    status: "ended",
    typeLabel: "Wedding",
    accessLabel: "Public · Ticketed",
    accessVariant: "public",
    dateLine: "Sat 31 May 2025 · Concluded",
    locationLine: "Transcorp Hilton, Abuja",
    dimmed: true,
    metrics: [
      { label: "Final rev.", value: "₦3.8M" },
      { label: "Attended", value: "760" },
      { label: "Check-in", value: "94%" },
      { label: "Gifts", value: "₦510K" },
    ],
  },
  {
    title: "Emeka's MBA Graduation",
    banner: 5,
    status: "upcoming",
    typeLabel: "Graduation",
    accessLabel: "Invite only",
    accessVariant: "private",
    dateLine: "Sat 26 Jul 2025 · 2:00 PM",
    locationLine: "Four Points by Sheraton, Lagos",
    metrics: [
      { label: "Invited", value: "80" },
      { label: "RSVP'd", value: "54" },
      { label: "Tickets", value: "—" },
      { label: "Gifts", value: "₦250K", accent: true },
    ],
  },
];

const stroke = { className: "size-[13px]", strokeWidth: 1.1 as const };

export const demoActivityRows: ActivityRow[] = [
  {
    id: "1",
    iconWrapClass: "bg-evvnt-tint",
    icon: <Ticket {...stroke} className="size-[13px] text-evvnt-core" strokeWidth={1.1} />,
    title: (
      <>
        <strong className="font-semibold text-evvnt-ink">Amaka Obi</strong> purchased 2× VIP tickets
      </>
    ),
    eventLine: "Okonkwo Wedding",
    timeLine: "2 minutes ago · via Paystack",
    amount: "₦50,000",
  },
  {
    id: "2",
    iconWrapClass: "bg-gradient-to-br from-evvnt-deep to-evvnt-core",
    icon: <Gift {...stroke} className="size-[13px] text-white/90" strokeWidth={1} />,
    title: (
      <>
        <strong className="font-semibold text-evvnt-ink">Chidi Ezema</strong> sent a cash gift with
        message
      </>
    ),
    eventLine: "Okonkwo Wedding",
    timeLine: '8 minutes ago · "Wishing you joy!"',
    amount: "₦25,000",
  },
  {
    id: "3",
    iconWrapClass: "bg-evvnt-ink",
    icon: <Check className="size-[13px] text-evvnt-soft" strokeWidth={1.4} />,
    title: (
      <>
        <strong className="font-semibold text-evvnt-ink">247 guests</strong> checked in — 72%
        attendance
      </>
    ),
    eventLine: "Okonkwo Wedding · live event",
    timeLine: "Live · updating now",
  },
  {
    id: "4",
    iconWrapClass: "bg-evvnt-success-subtle",
    icon: <Mail {...stroke} className="size-[13px] text-evvnt-success" />,
    title: (
      <>
        <strong className="font-semibold text-evvnt-ink">Ngozi Kalu</strong> RSVP'd yes with +1
      </>
    ),
    eventLine: "TechNext Lagos 2025",
    timeLine: "24 minutes ago",
  },
  {
    id: "5",
    iconWrapClass: "bg-evvnt-warn-subtle",
    icon: <LineChart className="size-[13px] text-evvnt-warn" strokeWidth={1.1} />,
    title: (
      <>
        <strong className="font-semibold text-evvnt-ink">AV Solutions Ltd</strong> submitted final
        invoice
      </>
    ),
    eventLine: "TechNext Lagos 2025",
    timeLine: "2 hours ago · awaiting your approval",
    amount: "₦280K",
    amountClassName: "!text-evvnt-warn",
  },
  {
    id: "6",
    iconWrapClass: "bg-evvnt-danger-subtle",
    icon: <Wallet {...stroke} className="size-[13px] text-evvnt-danger" />,
    title: (
      <>
        Photography category hit <strong className="font-semibold text-evvnt-ink">100%</strong>{" "}
        budget limit
      </>
    ),
    eventLine: "Okonkwo Wedding · budget alert",
    timeLine: "3 hours ago",
    amount: "⚠ ₦450K",
    amountClassName: "!text-evvnt-danger",
  },
];

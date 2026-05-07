import {
  GuestDetailRow,
  type GuestGroup,
  type GuestRow,
  GuestStatCard,
  GuestStatusBadge,
  GuestsTopActions,
} from "@/components/molecules";
import { Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import { toast } from "@ui/sonner";
import { Bell, Download, Ellipsis, Filter, Mail, UserPlus } from "lucide-react";
import { useMemo, useRef, useState } from "react";

const initialRows: GuestRow[] = [
  {
    id: "1",
    initials: "AO",
    name: "Amaka Obi",
    email: "amaka.obi@gmail.com",
    status: "checked-in",
    group: "VIP",
    table: "Table 1",
    ticket: "VIP · N25K",
    plusOne: "+1",
    invitedAt: "Jun 1",
  },
  {
    id: "2",
    initials: "CF",
    name: "Chukwuemeka Folarin",
    email: "cfolarin@outlook.com",
    status: "yes",
    group: "General",
    table: "Table 4",
    ticket: "Regular · N15K",
    plusOne: "-",
    invitedAt: "Jun 3",
  },
  {
    id: "3",
    initials: "TN",
    name: "Taiwo Nwosu",
    email: "taiwo.n@yahoo.com",
    status: "awaiting",
    group: "Family",
    table: "Unassigned",
    ticket: "-",
    plusOne: "-",
    invitedAt: "Jun 5",
  },
];

function parseGuestsCsv(
  input: string,
): Array<Pick<GuestRow, "name" | "email"> & { phone?: string }> {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const header = lines[0].toLowerCase();
  const hasHeader =
    header.includes("name") && (header.includes("email") || header.includes("phone"));
  const body = hasHeader ? lines.slice(1) : lines;

  return body
    .map((line) => line.split(",").map((part) => part.trim()))
    .map((cols) => {
      const [name = "", email = "", phone = ""] = cols;
      return { name, email, phone };
    })
    .filter((row) => row.name.length > 0);
}

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
}

export function GuestsPage() {
  const [rows, setRows] = useState<GuestRow[]>(initialRows);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "checked-in" | "yes" | "awaiting" | "declined" | "invited" | "no-show"
  >("all");
  const [groupFilter, setGroupFilter] = useState<"all" | GuestGroup>("all");
  const importInputRef = useRef<HTMLInputElement>(null);

  const counts = useMemo(() => {
    return {
      invited: rows.length,
      yes: rows.filter((row) => row.status === "yes" || row.status === "checked-in").length,
      awaiting: rows.filter((row) => row.status === "awaiting").length,
      declined: rows.filter((row) => row.status === "declined").length,
    };
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const statusOk = statusFilter === "all" ? true : row.status === statusFilter;
      const groupOk = groupFilter === "all" ? true : row.group === groupFilter;
      const q = search.trim().toLowerCase();
      const searchOk =
        q.length === 0
          ? true
          : row.name.toLowerCase().includes(q) ||
            row.email.toLowerCase().includes(q) ||
            row.table.toLowerCase().includes(q);
      return statusOk && groupOk && searchOk;
    });
  }, [rows, statusFilter, groupFilter, search]);

  const selectedCount = selectedIds.length;

  const selectedGuest = rows.find((row) => row.id === selectedIds[0]) ?? rows[0] ?? null;

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function removeSelected() {
    if (selectedIds.length === 0) return;
    setRows((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
    setSelectedIds([]);
  }

  function setSelectedGroup(group: GuestGroup) {
    if (selectedIds.length === 0) return;
    setRows((prev) => prev.map((row) => (selectedIds.includes(row.id) ? { ...row, group } : row)));
  }

  async function handleImportFile(file: File | null) {
    if (!file) return;
    const text = await file.text();
    const parsed = parseGuestsCsv(text);
    if (parsed.length === 0) {
      toast.error("No valid guest rows found in file");
      return;
    }

    const existingKeys = new Set(rows.map((row) => row.email.trim().toLowerCase()).filter(Boolean));
    let duplicates = 0;
    const toAdd: GuestRow[] = [];
    for (const item of parsed) {
      const emailKey = item.email.trim().toLowerCase();
      if (emailKey && existingKeys.has(emailKey)) {
        duplicates += 1;
        continue;
      }
      if (emailKey) existingKeys.add(emailKey);
      toAdd.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        initials: initialsFor(item.name),
        name: item.name,
        email: item.email || `${item.name.replace(/\s+/g, ".").toLowerCase()}@unknown.local`,
        status: "invited",
        group: "General",
        table: "Unassigned",
        ticket: "-",
        plusOne: "-",
        invitedAt: new Date().toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
      });
    }
    setRows((prev) => [...toAdd, ...prev]);
    toast.success(`Imported ${toAdd.length} guests`, {
      description: duplicates > 0 ? `${duplicates} duplicates were skipped.` : undefined,
    });
  }

  function handleAddGuest() {
    const id = `${Date.now()}`;
    setRows((prev) => [
      {
        id,
        initials: "NG",
        name: "New Guest",
        email: `guest-${id.slice(-4)}@example.com`,
        status: "invited",
        group: "General",
        table: "Unassigned",
        ticket: "-",
        plusOne: "-",
        invitedAt: new Date().toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
      },
      ...prev,
    ]);
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <header className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-evvnt-n200 bg-white px-4 sm:px-6">
        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/events">Events</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="max-w-[180px] truncate text-[13px] text-evvnt-n500 sm:max-w-[260px]">
                Okonkwo Wedding
              </span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Guests</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <GuestsTopActions
          searchValue={search}
          onSearchValueChange={setSearch}
          onImportClick={() => importInputRef.current?.click()}
          onAddGuestClick={handleAddGuest}
        />
        <input
          ref={importInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => void handleImportFile(e.target.files?.[0] ?? null)}
        />
      </header>

      <div className="min-h-0 flex-1 overflow-hidden bg-evvnt-mist">
        <div className="flex h-full min-h-0">
          <aside className="hidden w-[220px] shrink-0 border-r border-evvnt-n200 bg-white lg:block">
            <div className="border-b border-evvnt-n100 p-4">
              <div className="text-[10px] font-semibold tracking-wider text-evvnt-n400 uppercase">
                Summary
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <GuestStatCard label="Invited" value={String(counts.invited)} />
                <GuestStatCard label="RSVP'd yes" value={String(counts.yes)} />
                <GuestStatCard label="Awaiting" value={String(counts.awaiting)} />
                <GuestStatCard label="Declined" value={String(counts.declined)} />
              </div>
              <div className="mt-3 space-y-2 text-[11px]">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className="rounded-full border border-evvnt-n200 px-2 py-1 text-evvnt-n600"
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("yes")}
                    className="rounded-full border border-evvnt-n200 px-2 py-1 text-evvnt-n600"
                  >
                    RSVP yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("awaiting")}
                    className="rounded-full border border-evvnt-n200 px-2 py-1 text-evvnt-n600"
                  >
                    Awaiting
                  </button>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setGroupFilter("all")}
                    className="rounded-full border border-evvnt-n200 px-2 py-1 text-evvnt-n600"
                  >
                    All groups
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroupFilter("VIP")}
                    className="rounded-full border border-evvnt-n200 px-2 py-1 text-evvnt-n600"
                  >
                    VIP
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroupFilter("Family")}
                    className="rounded-full border border-evvnt-n200 px-2 py-1 text-evvnt-n600"
                  >
                    Family
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex shrink-0 items-center gap-2 border-b border-evvnt-n200 bg-white px-4 py-3 sm:px-5">
              <span className="text-xs font-semibold text-evvnt-ink">
                {filteredRows.length} guests
              </span>
              <span className="text-xs text-evvnt-n400">· {selectedCount} selected</span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1 rounded-evvnt-md border border-evvnt-n200 px-2.5 text-xs text-evvnt-n500"
                >
                  <Filter className="size-3.5" />
                  Filter
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1 rounded-evvnt-md border border-evvnt-n200 px-2.5 text-xs text-evvnt-n500"
                >
                  <Download className="size-3.5" />
                  Export
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGroup("VIP")}
                  disabled={selectedCount === 0}
                  className="inline-flex h-8 items-center gap-1 rounded-evvnt-md border border-evvnt-n200 px-2.5 text-xs text-evvnt-n500 disabled:opacity-40"
                >
                  <UserPlus className="size-3.5" />
                  Set VIP
                </button>
                <button
                  type="button"
                  onClick={removeSelected}
                  disabled={selectedCount === 0}
                  className="inline-flex h-8 items-center gap-1 rounded-evvnt-md border border-evvnt-danger-light px-2.5 text-xs text-evvnt-danger disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-evvnt-n50">
                  <tr className="border-b border-evvnt-n200 text-left text-[10px] tracking-wide text-evvnt-n400 uppercase">
                    <th className="px-4 py-2.5 sm:px-5">Guest</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Group</th>
                    <th className="px-4 py-2.5">Table</th>
                    <th className="px-4 py-2.5">Ticket</th>
                    <th className="px-4 py-2.5">+1</th>
                    <th className="px-4 py-2.5">Invited</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredRows.map((row) => (
                    <tr key={row.id} className="border-b border-evvnt-n100 hover:bg-evvnt-n50/50">
                      <td className="px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(row.id)}
                            onChange={() => toggleSelect(row.id)}
                            className="size-4 accent-evvnt-core"
                          />
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-evvnt-vivid text-[11px] font-bold text-white">
                            {row.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-medium text-evvnt-ink">
                              {row.name}
                            </div>
                            <div className="truncate text-[11px] text-evvnt-n400">{row.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <GuestStatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-evvnt-n700">{row.group}</td>
                      <td className="px-4 py-3 text-xs text-evvnt-n700">{row.table}</td>
                      <td className="px-4 py-3 text-xs text-evvnt-n700">{row.ticket}</td>
                      <td className="px-4 py-3 text-xs text-evvnt-n700">{row.plusOne}</td>
                      <td className="px-4 py-3 text-xs text-evvnt-n400">{row.invitedAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="rounded-evvnt-sm border border-evvnt-n200 p-1.5 text-evvnt-n400"
                          >
                            <Mail className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            className="rounded-evvnt-sm border border-evvnt-n200 p-1.5 text-evvnt-n400"
                          >
                            <Ellipsis className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="hidden w-[300px] shrink-0 border-l border-evvnt-n200 bg-white xl:block">
            <div className="border-b border-evvnt-n100 p-4">
              <div className="text-[14px] font-semibold text-evvnt-ink">
                {selectedGuest?.name ?? "No guest selected"}
              </div>
              <div className="mt-1 text-xs text-evvnt-n400">{selectedGuest?.email ?? "-"}</div>
              <span className="mt-2 inline-flex rounded-full bg-evvnt-ink px-2 py-1 text-[10px] font-semibold text-evvnt-tint">
                Checked in · 2:14 PM
              </span>
            </div>
            <div className="space-y-3 p-4 text-xs">
              <GuestDetailRow label="Phone" value="+234 812 345 6789" />
              <GuestDetailRow label="Group" value={selectedGuest?.group ?? "-"} />
              <GuestDetailRow label="Table" value={selectedGuest?.table ?? "-"} />
              <GuestDetailRow label="Ticket" value={selectedGuest?.ticket ?? "-"} />
              <GuestDetailRow label="Gift" value="N10,000" />
            </div>
            <div className="border-t border-evvnt-n100 p-4">
              <button
                type="button"
                className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-evvnt-md bg-evvnt-core text-xs font-semibold text-white"
              >
                <Bell className="size-3.5" />
                Send message
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

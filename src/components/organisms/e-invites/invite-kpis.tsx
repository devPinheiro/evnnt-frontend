type InviteKpiItem = {
  id: string;
  label: string;
  value: string;
  hint: string;
};

type InviteKpisProps = {
  items: InviteKpiItem[];
};

export function InviteKpis({ items }: InviteKpisProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-evvnt-xl border border-evvnt-n200 bg-white p-4 shadow-[0_1px_2px_rgb(26_9_51_/_5%)]"
        >
          <div className="text-[10px] font-semibold tracking-wide text-evvnt-n400 uppercase">
            {item.label}
          </div>
          <div className="mt-1 text-2xl font-bold tracking-tight text-evvnt-core">{item.value}</div>
          <div className="mt-1 text-[11px] text-evvnt-n500">{item.hint}</div>
        </article>
      ))}
    </section>
  );
}

export type { InviteKpiItem };

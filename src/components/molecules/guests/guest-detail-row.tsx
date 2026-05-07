export type GuestDetailRowProps = {
  label: string;
  value: string;
};

export function GuestDetailRow({ label, value }: GuestDetailRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-evvnt-n100 py-1.5 last:border-0">
      <span className="text-evvnt-n400">{label}</span>
      <span className="font-medium text-evvnt-ink">{value}</span>
    </div>
  );
}

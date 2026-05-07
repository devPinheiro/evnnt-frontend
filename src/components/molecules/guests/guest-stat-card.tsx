export type GuestStatCardProps = {
  label: string;
  value: string;
};

export function GuestStatCard({ label, value }: GuestStatCardProps) {
  return (
    <div className="rounded-evvnt-md bg-evvnt-n50 p-2">
      <div className="text-[15px] font-bold text-evvnt-ink">{value}</div>
      <div className="text-[10px] text-evvnt-n400">{label}</div>
    </div>
  );
}

import { Plus, Search, Upload } from "lucide-react";

export type GuestsTopActionsProps = {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  onImportClick?: () => void;
  onAddGuestClick?: () => void;
};

export function GuestsTopActions({
  searchPlaceholder = "Search name, email, phone...",
  searchValue,
  onSearchValueChange,
  onImportClick,
  onAddGuestClick,
}: GuestsTopActionsProps) {
  return (
    <div className="hidden items-center gap-2 sm:flex">
      <div className="flex h-9 w-[240px] items-center gap-2 rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist px-3">
        <Search className="size-3.5 text-evvnt-n400" />
        <input
          className="w-full border-0 bg-transparent text-xs text-evvnt-ink outline-none placeholder:text-evvnt-n400"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchValueChange?.(e.target.value)}
        />
      </div>
      <button
        type="button"
        onClick={onImportClick}
        className="inline-flex h-9 items-center gap-1.5 rounded-evvnt-md border border-evvnt-n200 bg-white px-3 text-xs text-evvnt-n500"
      >
        <Upload className="size-3.5" />
        Import
      </button>
      <button
        type="button"
        onClick={onAddGuestClick}
        className="inline-flex h-9 items-center gap-1.5 rounded-evvnt-md bg-evvnt-core px-3 text-xs font-semibold text-white"
      >
        <Plus className="size-3.5" />
        Add Guest
      </button>
    </div>
  );
}

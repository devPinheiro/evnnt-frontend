import type { EventRow } from "@/services/events.api";
import endpoints from "@endpoints";
import { useQueryData } from "@hooks";

export type { EventRow };

export const useListEvents = () =>
  useQueryData<{ events: EventRow[] }>({
    url: endpoints.events.list,
    queryKey: ["events"],
  });

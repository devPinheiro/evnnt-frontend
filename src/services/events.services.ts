import endpoints from "@endpoints";
import { useQueryData } from "@hooks";

/** Mirrors Evvnt Prisma `Event` JSON (dates are ISO strings over the wire). */
export type EventRow = {
  id: string;
  organisationId: string;
  name: string;
  slug: string;
  description?: string | null;
  coverImageUrl?: string | null;
  status: string;
  startsAt: string | null;
  endsAt?: string | null;
  timezone?: string | null;
  location?: string | null;
  isOnline?: boolean;
  publishedAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export const useListEvents = () =>
  useQueryData<{ events: EventRow[] }>({
    url: endpoints.events.list,
    queryKey: ["events"],
  });

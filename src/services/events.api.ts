import { http } from "@/lib/http";
import { type ApiSuccess, unwrap } from "@types";

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

export async function listEvents() {
  const { data } = await http.get<ApiSuccess<{ events: EventRow[] }>>("/api/v1/events");
  return unwrap(data).events;
}

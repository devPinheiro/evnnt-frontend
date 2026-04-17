import { http } from "@/lib/http";
import endpoints from "@endpoints";
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
  const { data } = await http.get<ApiSuccess<{ events: EventRow[] }>>(endpoints.events.list);
  return unwrap(data).events;
}

/** Body for `POST /api/v1/events` — aligns with Evvnt `Event` create DTO */
export type CreateEventBody = {
  name: string;
  description?: string | null;
  startsAt: string;
  endsAt?: string | null;
  timezone?: string | null;
  location?: string | null;
  isOnline?: boolean;
};

export async function createEvent(body: CreateEventBody) {
  const { data } = await http.post<ApiSuccess<{ event: EventRow }>>(endpoints.events.create, body);
  return unwrap(data).event;
}

export type ApiSuccess<T> = { ok: true; data: T };

export type ApiErrorBody = {
  ok: false;
  error: { code: string; message: string; details?: unknown };
};

export function unwrap<T>(body: ApiSuccess<T> | ApiErrorBody): T {
  if (!body.ok) {
    throw new Error(body.error.message);
  }
  return body.data;
}

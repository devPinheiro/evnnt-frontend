import { MUTATION_ERROR_FALLBACKS } from "@/data/mutation-messages";
import type { ApiErrorBody } from "@types";
import { isAxiosError } from "axios";

function isErrorEnvelope(x: unknown): x is ApiErrorBody {
  return (
    typeof x === "object" &&
    x !== null &&
    "ok" in x &&
    (x as ApiErrorBody).ok === false &&
    "error" in x &&
    typeof (x as ApiErrorBody).error?.message === "string"
  );
}

/** Readable message from API `{ ok: false, error }` or Axios/network failures. */
export function getApiErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (isAxiosError(err) && err.response?.data !== undefined) {
      const d = err.response.data;
      if (isErrorEnvelope(d)) return d.error.message;
    }
    return err.message;
  }
  return "Something went wrong";
}

type MutationMethod = keyof typeof MUTATION_ERROR_FALLBACKS;

/** Method-aware fallback after `getApiErrorMessage` — aligned with EHR `getErrorMessage`. */
export function getMutationErrorMessage(error: unknown, method: MutationMethod): string {
  const extracted = getApiErrorMessage(error);
  if (extracted !== "Something went wrong") {
    return extracted;
  }
  return MUTATION_ERROR_FALLBACKS[method];
}

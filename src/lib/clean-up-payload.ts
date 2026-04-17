/**
 * Strip empty optional values before API submission — ported from EHR `cleanUpPayload`
 * (no lodash; keeps `false` and `0`).
 */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isEmptyObject(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}

export function cleanUpPayload<P extends object>(obj?: P | null): P {
  if (obj === undefined || obj === null) {
    return {} as P;
  }

  if (Array.isArray(obj)) {
    const cleanedArr = obj
      .map((item) => cleanUpPayload(item as object))
      .filter((item) => {
        if (Array.isArray(item)) return item.length > 0;
        if (isPlainObject(item)) return !isEmptyObject(item);
        if (typeof item === "string") return item !== "";
        return item !== undefined && item !== null;
      });
    return (cleanedArr.length > 0 ? cleanedArr : {}) as P;
  }

  if (isPlainObject(obj)) {
    const cleanedObj = Object.entries(obj).reduce(
      (acc, [key, value]) => {
        const cleanedValue = cleanUpPayload(value as object);
        if (
          cleanedValue !== undefined &&
          cleanedValue !== null &&
          !(typeof cleanedValue === "string" && cleanedValue === "") &&
          !(Array.isArray(cleanedValue) && cleanedValue.length === 0) &&
          !(isPlainObject(cleanedValue) && isEmptyObject(cleanedValue))
        ) {
          acc[key] = cleanedValue;
        }
        return acc;
      },
      {} as Record<string, unknown>,
    );
    return (!isEmptyObject(cleanedObj) ? cleanedObj : {}) as P;
  }

  return obj;
}

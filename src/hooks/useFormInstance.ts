import { cleanUpPayload } from "@/lib/clean-up-payload";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QueryKey } from "@tanstack/react-query";
import { type FieldValues, type Resolver, type UseFormProps, useForm } from "react-hook-form";
import type { z } from "zod";

import { useMutationData } from "./useReactQueries";

type HttpMethod = "post" | "patch" | "put" | "delete" | "postForm";

function resolveMutationUrl(
  urls: [string] | [string, string] | undefined,
  formId: number | string | undefined,
  trailingUrl: string | undefined,
): string {
  const tuple = urls ?? ["", ""];
  const create = tuple[0] ?? "";
  const update = tuple[1];
  if (formId !== undefined && formId !== "") {
    const base = (update ?? create).replace(/\/$/, "");
    return `${base}/${String(formId)}${trailingUrl ? `/${String(trailingUrl).replace(/^\/|\/$/g, "")}` : ""}`;
  }
  if (!create) {
    return "";
  }
  const base = create.replace(/\/$/, "");
  return trailingUrl ? `${base}/${String(trailingUrl).replace(/^\/|\/$/g, "")}` : create;
}

export type UseFormInstanceProps<S extends z.ZodTypeAny, P extends object> = Omit<
  UseFormProps<z.output<S> & FieldValues>,
  "resolver"
> & {
  schema: S;
  /** POST URL, or `[createUrl, updateBase]` when editing with `formId` (request goes to `updateBase/:id`). */
  urls?: [string] | [string, string];
  formId?: number | string;
  trailingUrl?: string;
  preventClose?: boolean;
  updateOnly?: boolean;
  updateMethod?: "patch" | "put" | "post";
  defaultMethod?: "post" | "postForm";
  queryKey?: QueryKey;
  queryKeys?: QueryKey[];
  successMessage?: string;
  errorMessage?: string;
  transformPayload?: (values: z.output<S> & FieldValues) => P;
  onSuccessClose?: () => void;
  callbackFn?: () => void;
};

/**
 * Zod + RHF + `useMutationData` — EHR `useFormInstance` pattern (Yup → Zod; no `useSheetState`).
 * Use `handleSubmit` for validated submit. Use `mutate` when the payload is already API-shaped.
 */
export function useFormInstance<
  S extends z.ZodTypeAny,
  TResponse extends object,
  P extends object,
>({
  schema,
  urls,
  formId,
  trailingUrl,
  preventClose = false,
  updateOnly = false,
  updateMethod = "patch",
  defaultMethod = "post",
  queryKey,
  queryKeys,
  successMessage,
  errorMessage,
  transformPayload,
  onSuccessClose,
  callbackFn,
  ...rest
}: UseFormInstanceProps<S, P>) {
  type F = z.output<S> & FieldValues;

  const form = useForm<F, unknown, F>({
    mode: "onChange",
    resolver: zodResolver(schema as never) as unknown as Resolver<F, unknown, F>,
    ...rest,
  });

  const url = resolveMutationUrl(urls, formId, trailingUrl);
  const method = (updateOnly || Boolean(formId) ? updateMethod : defaultMethod) as HttpMethod;

  const mutation = useMutationData<TResponse, P>({
    url,
    method,
    queryKey,
    queryKeys,
    successMessage,
    errorMessage,
  });

  const runWithPayload = (payload: P) => {
    mutation.mutate(payload, {
      onSuccess: () => {
        form.reset();
        if (!preventClose) {
          queueMicrotask(() => onSuccessClose?.());
        }
        callbackFn?.();
      },
    });
  };

  const handleSubmit = form.handleSubmit((values) => {
    const cleaned = cleanUpPayload(values as object) as F;
    const payload = transformPayload ? transformPayload(cleaned) : (cleaned as unknown as P);
    runWithPayload(payload);
  });

  const mutate = (payload: P) => {
    runWithPayload(cleanUpPayload(payload as object) as P);
  };

  return {
    form,
    formInstance: form,
    mutation,
    handleSubmit,
    mutate,
    isPending: mutation.isPending,
  };
}

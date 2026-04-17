import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldValues, type Resolver, type UseFormProps, useForm } from "react-hook-form";
import type { z } from "zod";

/**
 * React Hook Form + Zod with EHR defaults (`mode: onChange`).
 * Use for screens that handle submit / navigation themselves (e.g. auth).
 */
export function useZodForm<TValues extends FieldValues>(
  schema: z.ZodType<TValues>,
  formProps?: Omit<UseFormProps<TValues>, "resolver">,
) {
  return useForm<TValues, unknown, TValues>({
    mode: "onChange",
    // Zod 4 + @hookform/resolvers: bridge until types align
    resolver: zodResolver(schema as never) as Resolver<TValues, unknown, TValues>,
    ...formProps,
  });
}

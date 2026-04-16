import { type QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { http } from "@/lib/http";
import type { ApiSuccess } from "@/types/api";
import { unwrap } from "@/types/api";

type HttpMethod = "post" | "patch" | "put" | "delete";

export const useQueryData = <T extends object>({
  url,
  queryKey,
  params,
  config,
  enabled,
}: {
  url: string;
  queryKey: QueryKey;
  params?: Record<string, unknown>;
  config?: AxiosRequestConfig;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey,
    enabled,
    queryFn: async (): Promise<T> => {
      const { data } = await http.get<ApiSuccess<T>>(url, { ...config, params });
      return unwrap(data);
    },
  });
};

// biome-ignore lint/suspicious/noConfusingVoidType: payload can be omitted
export const useMutationData = <T extends object, P extends object | void>({
  url,
  method = "post",
  queryKey,
  queryKeys,
  config,
  errorMessage,
  successMessage,
}: {
  url: string;
  method?: HttpMethod;
  queryKey?: QueryKey;
  queryKeys?: QueryKey[];
  config?: AxiosRequestConfig;
  errorMessage?: string;
  successMessage?: string;
}) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (payload?: P): Promise<T> => {
      if (method === "delete") {
        const { data } = await http.delete<ApiSuccess<T>>(url, { ...config, data: payload });
        return unwrap(data);
      }
      const { data } = await http[method]<ApiSuccess<T>>(url, payload, config);
      return unwrap(data);
    },
    onError: (error) => {
      toast.error(errorMessage ?? getApiErrorMessage(error));
    },
    onSuccess: async () => {
      if (queryKeys) {
        await Promise.all(queryKeys.map((key) => client.invalidateQueries({ queryKey: key })));
      }
      if (queryKey) {
        await client.invalidateQueries({ queryKey });
      }
      if (successMessage) {
        toast.success(successMessage);
      }
    },
  });
};

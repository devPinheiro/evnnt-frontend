import { SUCCESS_MESSAGES } from "@/data/mutation-messages";
import { getMutationErrorMessage } from "@/lib/api-error";
import { http } from "@/lib/http";
import { getQueryParam } from "@/lib/query-param";
import { type ApiSuccess, unwrap } from "@/types/api";
import type { TPagination } from "@/types/pagination";
import {
  type QueriesObserverOptions,
  type QueryKey,
  type UseInfiniteQueryOptions,
  type UseMutationOptions,
  type UseQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import type { MouseEvent } from "react";

import { toast } from "@ui/sonner";

type HttpMethod = "post" | "patch" | "put" | "delete" | "postForm";

export type TUseQueryOptions<T> = Partial<UseQueryOptions<T, Error>>;

export const useQueryData = <T extends object>({
  url,
  params,
  queryKey,
  options,
  config,
  enabled,
}: {
  url: string;
  queryKey: QueryKey;
  params?: Record<string, unknown>;
  options?: TUseQueryOptions<T>;
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
    ...options,
  });
};

export type TUseQueriesOptions<T> = Partial<
  QueriesObserverOptions<{ data: T[]; isPending: boolean }>
>;

export const useQueriesData = <T extends object>({
  queries,
  queriesOptions,
}: {
  queries: {
    params?: Record<string, unknown>;
    url: string;
    queryKey: QueryKey;
    config?: AxiosRequestConfig;
    options?: TUseQueryOptions<T>;
  }[];
  queriesOptions?: TUseQueriesOptions<T>;
}) => {
  return useQueries({
    queries: queries.map(({ url, queryKey, options, config, params }) => ({
      queryKey,
      queryFn: async (): Promise<T> => {
        const { data } = await http.get<ApiSuccess<T>>(url, { ...config, params });
        return unwrap(data);
      },
      ...options,
    })),
    ...queriesOptions,
  });
};

export const useSuspenseQueryData = <T extends object>({
  url,
  params,
  queryKey,
  config,
}: {
  params?: Record<string, unknown>;
  url: string;
  queryKey: QueryKey;
  config?: AxiosRequestConfig;
}) => {
  return useSuspenseQuery({
    queryKey,
    queryFn: async (): Promise<T> => {
      const { data } = await http.get<ApiSuccess<T>>(url, { params, ...config });
      return unwrap(data);
    },
  });
};

export type TUseInfiniteQueryOptions<TItem extends object> = Partial<
  UseInfiniteQueryOptions<TPagination<TItem>, Error, InfinitePages<TItem>, QueryKey, number>
>;

type InfinitePages<TItem extends object> = {
  pages: TPagination<TItem>[];
  pageParams: number[];
};

export const useInfiniteQueryData = <TItem extends object>({
  url,
  params,
  queryKey,
  options,
  config,
}: {
  params?: Record<string, unknown>;
  url: string;
  queryKey: QueryKey;
  options?: TUseInfiniteQueryOptions<TItem>;
  config?: AxiosRequestConfig;
}) => {
  return useInfiniteQuery<TPagination<TItem>, Error, InfinitePages<TItem>, QueryKey, number>({
    ...options,
    queryKey,
    queryFn: async ({ pageParam: page }): Promise<TPagination<TItem>> => {
      const { data } = await http.get<ApiSuccess<TPagination<TItem>>>(url, {
        params: { ...params, page },
        ...config,
      });
      return unwrap(data);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => getQueryParam(lastPage?.next, "page"),
  });
};

function successDescription<T extends object>(
  data: T,
  method: keyof typeof SUCCESS_MESSAGES,
  successMessage?: string,
): string {
  if (successMessage) {
    return successMessage;
  }
  if ("message" in data && typeof (data as { message?: unknown }).message === "string") {
    return (data as { message: string }).message;
  }
  return SUCCESS_MESSAGES[method];
}

const doneAction = {
  label: "Done",
  onClick: (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  },
} as const;

// biome-ignore lint/suspicious/noConfusingVoidType: payload can be omitted for some mutations
export const useMutationData = <T extends object, P extends object | void>({
  url,
  method = "post",
  queryKey,
  queryKeys,
  config,
  errorMessage,
  successMessage,
  skipSuccessToast,
  skipErrorToast,
  options,
}: {
  url: string;
  method?: HttpMethod;
  queryKey?: QueryKey;
  queryKeys?: QueryKey[];
  config?: AxiosRequestConfig;
  errorMessage?: string;
  successMessage?: string;
  /** When true, callers handle success UX (e.g. auth redirects + custom toast). */
  skipSuccessToast?: boolean;
  /** When true, callers handle errors (e.g. login form `catch` + `toast.error`). */
  skipErrorToast?: boolean;
  options?: UseMutationOptions<T, Error, P> | undefined;
}) => {
  const client = useQueryClient();

  return useMutation<T, Error, P>({
    mutationFn: async (payload?: P): Promise<T> => {
      if (method === "delete") {
        const { data } = await http.delete<ApiSuccess<T>>(url, { ...config, data: payload });
        return unwrap(data);
      }
      if (method === "postForm") {
        const { data } = await http.post<ApiSuccess<T>>(url, payload, config);
        return unwrap(data);
      }
      const { data } = await http[method](url, payload, config);
      return unwrap(data);
    },
    onError: (error) => {
      if (skipErrorToast) {
        return;
      }
      const message = errorMessage ?? getMutationErrorMessage(error, method);
      toast.error("Error", {
        description: message,
        action: doneAction,
      });
    },
    onSuccess: async (data) => {
      if (queryKeys) {
        await Promise.all(queryKeys.map((key) => client.invalidateQueries({ queryKey: key })));
      }
      if (queryKey) {
        await client.invalidateQueries({ queryKey });
      }
      if (!skipSuccessToast) {
        toast.success("Success", {
          description: successDescription(data, method, successMessage),
          action: doneAction,
        });
      }
    },
    ...options,
  });
};

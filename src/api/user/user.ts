import type {
  DataTag,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";

import type { CheckNickname200, CheckNicknameParams, UserInfoResponse, UserUpdateRequest } from ".././";

import type { AxiosRequestConfig } from "axios";
import authAxios from "../../utils/authAxios";

/**
 * 사용자의 프로필 정보를 수정합니다.
 * @summary 사용자 프로필 수정
 */
export const updateProfile = (userUpdateRequest: UserUpdateRequest, options?: AxiosRequestConfig) => {
  return authAxios.patch<void>(`/user/update`, userUpdateRequest, options);
};

export const getUpdateProfileMutationOptions = <TError = unknown, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateProfile>>,
    TError,
    { data: UserUpdateRequest },
    TContext
  >;
  request?: AxiosRequestConfig;
}): UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError, { data: UserUpdateRequest }, TContext> => {
  const mutationKey = ["updateProfile"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateProfile>>, { data: UserUpdateRequest }> = (
    props
  ) => {
    const { data } = props ?? {};
    return updateProfile(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateProfileMutationResult = NonNullable<Awaited<ReturnType<typeof updateProfile>>>;
export type UpdateProfileMutationBody = UserUpdateRequest;
export type UpdateProfileMutationError = unknown;

export const useUpdateProfile = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateProfile>>,
      TError,
      { data: UserUpdateRequest },
      TContext
    >;
    request?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseMutationResult<Awaited<ReturnType<typeof updateProfile>>, TError, { data: UserUpdateRequest }, TContext> => {
  const mutationOptions = getUpdateProfileMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
};

export const getUserInfo = (options?: AxiosRequestConfig, signal?: AbortSignal) => {
  return authAxios.get<UserInfoResponse>(`/user`, {
    ...options,
    signal,
  });
};

export const getGetUserInfoQueryKey = () => [`/user`] as const;

export const getGetUserInfoQueryOptions = <
  TData = Awaited<ReturnType<typeof getUserInfo>>,
  TError = unknown
>(options?: {
  query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserInfo>>, TError, TData>>;
  request?: AxiosRequestConfig;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetUserInfoQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUserInfo>>> = ({ signal }) =>
    getUserInfo(requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUserInfo>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetUserInfoQueryResult = NonNullable<Awaited<ReturnType<typeof getUserInfo>>>;
export type GetUserInfoQueryError = unknown;

export function useGetUserInfo<TData = Awaited<ReturnType<typeof getUserInfo>>, TError = unknown>(
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserInfo>>, TError, TData>>;
    request?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {
  const queryOptions = getGetUserInfoQueryOptions(options);
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };
  query.queryKey = queryOptions.queryKey;
  return query;
}

export const checkNickname = (params: CheckNicknameParams, options?: AxiosRequestConfig, signal?: AbortSignal) => {
  return authAxios.get<CheckNickname200>(`/user/check-nickname`, {
    params,
    signal,
    ...options,
  });
};

export const getCheckNicknameQueryKey = (params: CheckNicknameParams) => [`/user/check-nickname`, params] as const;

export const getCheckNicknameQueryOptions = <TData = Awaited<ReturnType<typeof checkNickname>>, TError = unknown>(
  params: CheckNicknameParams,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof checkNickname>>, TError, TData>>;
    request?: AxiosRequestConfig;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getCheckNicknameQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof checkNickname>>> = ({ signal }) =>
    checkNickname(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof checkNickname>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type CheckNicknameQueryResult = NonNullable<Awaited<ReturnType<typeof checkNickname>>>;
export type CheckNicknameQueryError = unknown;

export function useCheckNickname<TData = Awaited<ReturnType<typeof checkNickname>>, TError = unknown>(
  params: CheckNicknameParams,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof checkNickname>>, TError, TData>>;
    request?: AxiosRequestConfig;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {
  const queryOptions = getCheckNicknameQueryOptions(params, options);
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };
  query.queryKey = queryOptions.queryKey;
  return query;
}

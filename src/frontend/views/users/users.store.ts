import { msg } from "@lingui/macro";
import { useRouter } from "next/router";

import {
  MAKE_ENDPOINTS_CONFIG,
  useDomainMessages,
} from "@/frontend/lib/crud-config";
import { LANG_DOMAINS } from "@/frontend/lib/crud-config/lang-domains";
import { ApiRequest } from "@/frontend/lib/data/makeRequest";
import { useApi } from "@/frontend/lib/data/useApi";
import { MutationHelpers } from "@/frontend/lib/data/useMutate/mutation-helpers";
import { useApiMutateOptimisticOptions } from "@/frontend/lib/data/useMutate/useApiMutateOptimisticOptions";
import { useWaitForResponseMutationOptions } from "@/frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { NAVIGATION_LINKS } from "@/frontend/lib/routing/links";
import type { ICreateUserForm } from "@/shared/form-schemas/users";
import type { IResetPasswordForm } from "@/shared/form-schemas/users/reset-password";
import type { IAccountProfile } from "@/shared/types/user";

import { useUsernameFromRouteParam } from "./hooks";

export const USERS_ENDPOINT_CONFIG = MAKE_ENDPOINTS_CONFIG("/api/account");

export function useAllUsers() {
  return useApi<IAccountProfile[]>(USERS_ENDPOINT_CONFIG.LIST, {
    defaultData: [],
  });
}

export function useUserDetails(username: string) {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.USERS);

  return useApi<IAccountProfile>(USERS_ENDPOINT_CONFIG.DETAILS(username), {
    defaultData: {
      name: "",
      role: "",
      username: "",
    },
    errorMessage: domainMessages.TEXT_LANG.NOT_FOUND,
  });
}

export function useUserDeletionMutation() {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.USERS);
  const router = useRouter();
  return useApiMutateOptimisticOptions<IAccountProfile[], string>({
    mutationFn: async (username) =>
      await ApiRequest.DELETE(USERS_ENDPOINT_CONFIG.DELETE(username)),
    dataQueryPath: USERS_ENDPOINT_CONFIG.LIST,
    onSuccessActionWithFormData: () => {
      router.replace(NAVIGATION_LINKS.USERS.LIST);
    },
    onMutate: MutationHelpers.deleteByKey("username"),
    successMessage: { description: domainMessages.MUTATION_LANG.DELETE },
  });
}

export function useUpdateUserMutation() {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.USERS);
  const username = useUsernameFromRouteParam();
  return useWaitForResponseMutationOptions<Partial<IAccountProfile>>({
    mutationFn: async (data) =>
      await ApiRequest.PATCH(USERS_ENDPOINT_CONFIG.UPDATE(username), data),
    endpoints: [
      USERS_ENDPOINT_CONFIG.LIST,
      USERS_ENDPOINT_CONFIG.DETAILS(username),
    ],
    successMessage: { description: domainMessages.MUTATION_LANG.EDIT },
  });
}

export function useResetUserPasswordMutation() {
  const username = useUsernameFromRouteParam();
  return useWaitForResponseMutationOptions<IResetPasswordForm>({
    mutationFn: async (data) =>
      await ApiRequest.PATCH(
        USERS_ENDPOINT_CONFIG.CUSTOM(username, "reset-password"),
        data
      ),
    endpoints: [],
    successMessage: { description: msg`Password Reset Successfully` },
  });
}

export function useCreateUserMutation() {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.USERS);
  const router = useRouter();
  return useWaitForResponseMutationOptions<ICreateUserForm, ICreateUserForm>({
    mutationFn: async (data: ICreateUserForm) => {
      await ApiRequest.POST(USERS_ENDPOINT_CONFIG.CREATE, data);
      return data;
    },
    endpoints: [USERS_ENDPOINT_CONFIG.LIST],
    smartSuccessMessage: ({ username }) => ({
      description: domainMessages.MUTATION_LANG.CREATE,
      action: {
        label: domainMessages.MUTATION_LANG.VIEW_DETAILS,
        action: () => router.push(NAVIGATION_LINKS.USERS.DETAILS(username)),
      },
    }),
  });
}

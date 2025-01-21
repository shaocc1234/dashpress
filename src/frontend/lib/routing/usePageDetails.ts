import type { MessageDescriptor } from "@lingui/core";
import { useRouter } from "next/router";
import { useEffect } from "react";

import type { IGroupActionButton } from "@/components/app/button/types";
import { META_USER_PERMISSIONS } from "@/shared/constants/user";

import { createStore } from "../store";

export type IPageDetails = {
  pageTitle: MessageDescriptor;
  viewKey: string;
  pageLink: string;
  permission: string;
  actionItems?: IGroupActionButton[];
  secondaryActionItems?: IGroupActionButton[];
};

type IStore = {
  setPageDetails: (details: IPageDetails) => void;
  setPartialPageDetails: (details: Partial<IPageDetails>) => void;
} & Partial<IPageDetails>;

export const usePageDetailsStore = createStore<IStore>((set) => ({
  pageTitle: null,
  viewKey: "",
  pageLink: "/",
  permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  setPageDetails: (pageDetails: IPageDetails) => set(() => pageDetails),
  setPartialPageDetails: (pageDetails: Partial<IPageDetails>) =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set(({ setPageDetails: _, ...rest }) => ({ ...rest, ...pageDetails })),
}));

export const useSetPageDetails = (
  pageDetails: Omit<
    IPageDetails,
    "pageLink" | "actionItems" | "secondaryActionItems"
  >
) => {
  const router = useRouter();
  const setPageDetails = usePageDetailsStore((store) => store.setPageDetails);
  useEffect(() => {
    setPageDetails({
      ...pageDetails,
      actionItems: [],
      secondaryActionItems: [],
      pageLink: router.asPath,
    });
  }, [
    pageDetails.pageTitle.message,
    JSON.stringify(pageDetails.pageTitle.values),
  ]);
};

export const useSetCurrentActionItems = (
  pageDetails:
    | Pick<IPageDetails, "actionItems" | "secondaryActionItems">
    | undefined
) => {
  const setPartialPageDetails = usePageDetailsStore(
    (store) => store.setPartialPageDetails
  );
  useEffect(() => {
    if (pageDetails) {
      setTimeout(() => {
        setPartialPageDetails({ ...pageDetails });
      }, 100);
    }
  }, [pageDetails]);
};

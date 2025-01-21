import { msg } from "@lingui/macro";

import type { IAppConfigurationBag } from "@/shared/configurations/types";

export type IPortalSystemSettings = Record<string, unknown>;

export const PORTAL_DEFAULT_SYSTEM_SETTINGS = {};

export type PortalAppConfigurationKeys = "";

export const PORTAL_APP_CONFIGURATION_CONFIG: Record<
  PortalAppConfigurationKeys,
  IAppConfigurationBag
> = {
  "": {
    label: msg``,
    defaultValue: "",
  },
};

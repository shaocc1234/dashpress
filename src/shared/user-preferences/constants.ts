import type { BaseUserPreferencesKeys } from "./base-types";
import {
  PORTAL_CONFIGURATION_KEYS,
  type PortalUserPreferencesKeys,
} from "./portal";

export type UserPreferencesKeys =
  | BaseUserPreferencesKeys
  | PortalUserPreferencesKeys;

export const USER_PREFERENCES_CONFIG = {
  ...PORTAL_CONFIGURATION_KEYS,
  placeholder: {
    label: "Placehoder",
    defaultValue: "Placeholder",
  },
};

export type UserPreferencesValueType<T extends UserPreferencesKeys> =
  typeof USER_PREFERENCES_CONFIG[T]["defaultValue"];

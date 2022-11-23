import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { HTTP_ACTION_KEY } from "shared/types/actions";

export const ROOT_LINKS_TO_CLEAR_BREADCRUMBS = {
  HOME: NAVIGATION_LINKS.DASHBOARD,
  SETTINGS: NAVIGATION_LINKS.SETTINGS.DEFAULT,
  USERS: NAVIGATION_LINKS.USERS.LIST,
  ACCOUNT: NAVIGATION_LINKS.ACCOUNT.PROFILE,
  ROLES: NAVIGATION_LINKS.ROLES.LIST,
  ACTIONS: NAVIGATION_LINKS.ACTIONS.DETAILS(HTTP_ACTION_KEY),
};

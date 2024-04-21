import { META_USER_PERMISSIONS } from "shared/constants/user";
import { HOME_DASHBOARD_KEY } from "shared/types/dashboard";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useTranslations } from "next-intl";
import { BaseDashboard } from "./_BaseDashboard";

export function Dashboard() {
  const t = useTranslations("dashboard");
  useSetPageDetails({
    pageTitle: t("home"),
    viewKey: "HOME",
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  return (
    <BaseDashboard
      dashboardId={HOME_DASHBOARD_KEY}
      manageLink={NAVIGATION_LINKS.DASHBOARD.MANAGE}
    />
  );
}

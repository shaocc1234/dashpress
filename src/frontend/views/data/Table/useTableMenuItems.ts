import { useRouter } from "next/router";

import type { IMenuActionItem } from "@/components/app/button/types";
import { useEntityCrudConfig } from "@/frontend/hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "@/frontend/lib/routing/links";

import { useCanUserPerformCrudAction } from "../hooks/useCanUserPerformCrudAction";
import { usePluginTableMenuItems } from "./portal";

export const getEntityCreateLink = (
  entity: string,
  reference?: {
    referenceField: string;
    entityId: string;
  }
) => {
  let baseUrl = NAVIGATION_LINKS.ENTITY.CREATE(entity);
  if (reference) {
    baseUrl = `${baseUrl}?${reference.referenceField}=${reference.entityId}`;
  }

  return baseUrl;
};

export const useTableMenuItems = (
  entity: string,
  reference?: {
    referenceField: string;
    entityId: string;
  }
): IMenuActionItem[] => {
  const router = useRouter();
  const entityCrudConfig = useEntityCrudConfig(entity);
  const canUserPerformCrudAction = useCanUserPerformCrudAction(entity);

  const pluginTableMenuItems = usePluginTableMenuItems(entity, reference);

  if (!router.isReady) {
    return [];
  }

  if (reference && !reference.referenceField) {
    return [];
  }

  if (canUserPerformCrudAction("create")) {
    pluginTableMenuItems.push({
      id: "add",
      order: 1,
      label: entityCrudConfig.TEXT_LANG.CREATE,
      systemIcon: "Plus",
      action: getEntityCreateLink(entity, reference),
    });
  }

  return pluginTableMenuItems;
};

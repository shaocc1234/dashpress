import { msg } from "@lingui/macro";
import { SortableKnob } from "react-easy-sort";

import { ActionButtons } from "@/components/app/button/action";
import { DELETE_BUTTON_PROPS } from "@/components/app/button/constants";
import { SoftButton } from "@/components/app/button/soft";
import { DropDownMenu } from "@/components/app/drop-drop-menu";
import { GrabIcon } from "@/components/app/system-icons";
import { useDomainMessages } from "@/frontend/lib/crud-config";
import { LANG_DOMAINS } from "@/frontend/lib/crud-config/lang-domains";

import { useDashboardWidgetRelativeDateStore } from "../../../relativeTime.store";
import { DASHBOARD_RELATIVE_DAYS } from "./constants";
import type { IWidgetSettingProps } from "./types";

interface IProps {
  setting?: IWidgetSettingProps;
  title: string;
  widgetId: string;
  link?: string;
  isPreview?: boolean;
  hasRelativeDate: boolean;
}

export function WidgetHeader({
  title,
  setting,
  link,
  widgetId,
  isPreview,
  hasRelativeDate,
}: IProps) {
  const [setWidgetRelativeDate] = useDashboardWidgetRelativeDateStore(
    (store) => [store.setWidgetRelativeDate]
  );
  const domainMessages = useDomainMessages(LANG_DOMAINS.DASHBOARD.WIDGETS);

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        {setting && (
          <SortableKnob>
            <GrabIcon width={18} />
          </SortableKnob>
        )}
        <p className="truncate">{title}</p>
      </div>
      {setting ? (
        <ActionButtons
          size="icon"
          actionButtons={[
            {
              id: "edit",
              action: setting.setId,
              label: domainMessages.TEXT_LANG.EDIT,
              systemIcon: "Edit",
            },
            {
              ...DELETE_BUTTON_PROPS({
                action: setting.delete,
                label: domainMessages.TEXT_LANG.DELETE,
                isMakingRequest: false,
              }),
            },
          ]}
        />
      ) : (
        <div className="flex w-auto gap-2">
          {hasRelativeDate && !isPreview && (
            <DropDownMenu
              ariaLabel={`Toggle ${title} Menu`}
              contentClassName="[&_svg]:hidden"
              menuItems={DASHBOARD_RELATIVE_DAYS.map(({ label, value }) => ({
                id: value,
                label,
                systemIcon: "Filter",
                action: () => {
                  setWidgetRelativeDate({
                    widgetId,
                    currentRelativeDay: value,
                  });
                },
              }))}
            />
          )}
          {link && (
            <SoftButton
              action={link}
              label={msg`View`}
              systemIcon="Right"
              disabled={isPreview}
              size="icon"
            />
          )}
        </div>
      )}
    </div>
  );
}

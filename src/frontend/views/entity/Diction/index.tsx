import { msg } from "@lingui/macro";

import { SchemaForm } from "@/components/app/form/schema";
import { SectionBox } from "@/components/app/section-box";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { NAVIGATION_MENU_ENDPOINT } from "@/frontend/_layouts/app/NavigationSideBar/constants";
import { useDocumentationActionButton } from "@/frontend/docs/constants";
import { DictionDocumentation } from "@/frontend/docs/diction";
import { useAppConfigurationDomainMessages } from "@/frontend/hooks/configuration/configuration.constant";
import { useUpsertConfigurationMutation } from "@/frontend/hooks/configuration/configuration.store";
import {
  useEntityDiction,
  useEntitySlug,
} from "@/frontend/hooks/entity/entity.config";
import { useSetPageDetails } from "@/frontend/lib/routing/usePageDetails";
import type { AppConfigurationValueType } from "@/shared/configurations/constants";
import { UserPermissions } from "@/shared/constants/user";

import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";

export function EntityDictionSettings() {
  const entity = useEntitySlug();
  const domainMessages = useAppConfigurationDomainMessages("entity_diction");
  const entityDiction = useEntityDiction(entity);
  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "entity_diction",
    entity,
    {
      otherEndpoints: [NAVIGATION_MENU_ENDPOINT],
    }
  );

  const documentationActionButton = useDocumentationActionButton(
    domainMessages.TEXT_LANG.TITLE
  );

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: UserPermissions.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title={domainMessages.TEXT_LANG.TITLE}
        actionButtons={[documentationActionButton]}
      >
        <ViewStateMachine
          loading={false}
          error={false}
          loader={
            <FormSkeleton
              schema={[FormSkeletonSchema.Input, FormSkeletonSchema.Input]}
            />
          }
        >
          <SchemaForm<AppConfigurationValueType<"entity_diction">>
            onSubmit={upsertConfigurationMutation.mutateAsync}
            initialValues={entityDiction}
            systemIcon="Save"
            buttonText={domainMessages.FORM_LANG.UPSERT}
            fields={{
              plural: {
                label: msg`Plural`,
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                  {
                    validationType: "maxLength",
                    constraint: {
                      length: 32,
                    },
                  },
                ],
              },
              singular: {
                label: msg`Singular`,
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                  {
                    validationType: "maxLength",
                    constraint: {
                      length: 32,
                    },
                  },
                ],
              },
            }}
          />
        </ViewStateMachine>
      </SectionBox>
      <DictionDocumentation />
    </BaseEntitySettingsLayout>
  );
}

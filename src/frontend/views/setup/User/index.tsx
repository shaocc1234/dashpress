import { msg } from "@lingui/macro";

import { SchemaForm } from "@/components/app/form/schema";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { AuthLayout } from "@/frontend/_layouts/guest";
import type { CustomNextPage } from "@/frontend/_layouts/types";
import { useSetupCheck } from "@/frontend/hooks/setup/setup.store";
import { NAVIGATION_LINKS } from "@/frontend/lib/routing/links";
import type { ISetupUserForm } from "@/shared/form-schemas/setup/user";
import { SETUP_USER_FORM_SCHEMA } from "@/shared/form-schemas/setup/user";

import { useSetupUserMutation } from "../setup.store";

// eslint-disable-next-line react/function-component-definition
export const UserSetup: CustomNextPage = () => {
  const setupUserMutation = useSetupUserMutation();

  const isChecking = useSetupCheck([
    {
      key: "hasDbCredentials",
      value: false,
      url: NAVIGATION_LINKS.SETUP.CREDENTIALS,
    },
    {
      key: "hasUsers",
      value: true,
      url: NAVIGATION_LINKS.DASHBOARD.HOME,
    },
  ]);

  return (
    <AuthLayout
      title={msg`Account Setup`}
      subTitle={msg`Create first super admin account`}
    >
      <ViewStateMachine
        loading={isChecking}
        error={false}
        loader={
          <FormSkeleton
            schema={[
              FormSkeletonSchema.Input,
              FormSkeletonSchema.Input,
              FormSkeletonSchema.Input,
            ]}
          />
        }
      >
        <SchemaForm<ISetupUserForm>
          buttonText={(isSubmitting) =>
            isSubmitting ? msg`Setting Up Account` : msg`Setup Account`
          }
          onSubmit={setupUserMutation.mutateAsync}
          systemIcon="UserPlus"
          fields={SETUP_USER_FORM_SCHEMA}
        />
      </ViewStateMachine>
    </AuthLayout>
  );
};

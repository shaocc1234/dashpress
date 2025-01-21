import { msg } from "@lingui/macro";

import { useToggle } from "@/frontend/hooks/state/useToggleState";

import { FormInput } from "./text";
import type { ISharedFormInput } from "./types";

export function FormPasswordInput(formInput: ISharedFormInput) {
  const { rightActions = [] } = formInput;
  const showPassword = useToggle();
  return (
    <FormInput
      {...formInput}
      type={showPassword.isOn ? undefined : "password"}
      rightActions={[
        ...rightActions,
        showPassword.isOn
          ? {
              systemIcon: "EyeOff" as const,
              action: showPassword.toggle,
              label: msg`Hide Password`,
            }
          : {
              systemIcon: "Eye" as const,
              action: showPassword.toggle,
              label: msg`Show Password`,
            },
      ]}
    />
  );
}

import { useLingui } from "@lingui/react";

import { Input } from "@/components/ui/input";

import {
  generateClassNames,
  generateFormArias,
  LabelAndError,
} from "./label-and-error";
import type { ISharedFormInput } from "./types";

interface IFormInput extends ISharedFormInput {
  type?: "email" | "password" | "url" | "color" | "number";
}

export function FormInput(formInput: IFormInput) {
  const { input, type, disabled, meta, placeholder, required } = formInput;
  const { _ } = useLingui();
  return (
    <LabelAndError formInput={formInput}>
      <Input
        {...input}
        {...generateFormArias(meta)}
        required={required}
        type={type}
        id={input.name}
        className={generateClassNames(meta)}
        placeholder={placeholder ? _(placeholder) : null}
        disabled={disabled}
      />
    </LabelAndError>
  );
}

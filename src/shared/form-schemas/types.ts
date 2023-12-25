import { FormApi } from "final-form";
import { ISharedFormInput } from "frontend/design-system/components/Form/_types";
import { GridSpanSizes, IColorableSelection } from "shared/types/ui";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { IFieldValidationItem } from "shared/validations/types";

export interface ISchemaFormConfig {
  selections?: IColorableSelection[];
  apiSelections?: {
    listUrl: string;
    entity?: string;
    referenceUrl?: (value: string) => string;
  };
  type: keyof typeof FIELD_TYPES_CONFIG_MAP;
  label?: string;
  placeholder?: string;
  description?: string;
  span?: GridSpanSizes;
  rightActions?: (form: FormApi) => ISharedFormInput["rightActions"];
  validations: IFieldValidationItem[];
}

export type IAppliedSchemaFormConfig<T> = Record<keyof T, ISchemaFormConfig>;

export const FOR_CODE_COV = 1;

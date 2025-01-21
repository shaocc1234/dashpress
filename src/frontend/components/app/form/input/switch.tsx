import type { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import { useEffect } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export interface IProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: MessageDescriptor;
  name: string;
  disabled?: boolean;
}

export function FormSwitch(props: IProps) {
  const { value, onChange, name, label, disabled } = props;

  const { _ } = useLingui();

  useEffect(() => {
    if (value === undefined) {
      onChange(false);
    }
  }, [value, onChange]);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={name}
        disabled={disabled}
        checked={value}
        onCheckedChange={() => {
          onChange(!value);
        }}
      />
      {label && (
        <Label htmlFor={name} className="cursor-pointer">
          {_(label)}
        </Label>
      )}
    </div>
  );
}

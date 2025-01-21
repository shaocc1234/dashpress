/* eslint-disable react/function-component-definition */

import { action } from "@storybook/addon-actions";
import type { Story } from "@storybook/react";

import { TestProviders } from "@/tests/Provider";

import type { IProps } from ".";
import { Breadcrumbs } from ".";

export default {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  args: {
    items: [
      {
        value: "Foo",
        label: "Foo",
      },
      {
        value: "Bar",
        label: "Bar",
      },
      {
        value: "Baz",
        label: "Baz",
      },
    ],
    onItemClick: action("onItemClick"),
  },
};

const Template: Story<IProps> = (args) => (
  <TestProviders>
    <Breadcrumbs {...args} />
  </TestProviders>
);

export const Default = Template.bind({});
Default.args = {};

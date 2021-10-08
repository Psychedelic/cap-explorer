/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import Icon, { IconNames } from '.';

export default {
  title: 'Icon',
  component: Icon,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['xs', 'lg', 'sm', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x'],
      },
    },
    icon: {
      control: {
        type: 'select',
        options: IconNames,
      },
    },
  },
} as Meta;

const Template: Story<any> = (args) => (
  <Icon {...args} />
);

export const Example = Template.bind({});

Example.args = {
  icon: 'HomeAlt',
  size: 'lg',
  title: 'My icon',
};

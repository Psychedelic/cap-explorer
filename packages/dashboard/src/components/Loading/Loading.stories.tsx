/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import Loading from '.';

export default {
  title: 'Loading',
  component: Loading,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['s', 'm', 'l'],
      },
    },
  },
} as Meta;

const Template: Story<any> = (args) => (
  <Loading {...args} />
);

export const Example = Template.bind({});

Example.args = {
  alt: 'Loading example',
  size: 's',
};

import React from 'react';
import { Story, Meta } from '@storybook/react';
import { styled } from '@stitched';
import Breadcrumb, { BreadcrumbProps } from '.';

const Wrapper = styled('div', {
  background: '#000',
});

export default {
  title: 'Breadcrumb',
  component: Breadcrumb,
} as Meta;

// eslint-disable-next-line react/prop-types
const Template: Story<BreadcrumbProps> = ({ id }) => <Wrapper><Breadcrumb id={id} /></Wrapper>;

export const Primary = Template.bind({});
Primary.args = {
  id: '332ss-s-ssddssd-33323',
};

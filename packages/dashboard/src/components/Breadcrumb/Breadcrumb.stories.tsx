import React from 'react';
import { Story, Meta } from '@storybook/react';
import { styled } from '@stitched';
import Breadcrumb, { BreadcrumbProps } from '.';
import { Principal } from '@dfinity/principal';

const Wrapper = styled('div', {
  background: '#000',
});

export default {
  title: 'Breadcrumb',
  component: Breadcrumb,
} as Meta;

// eslint-disable-next-line react/prop-types
const Template: Story<BreadcrumbProps> = (props) => <Wrapper><Breadcrumb {...props} /></Wrapper>;

export const Primary = Template.bind({});
Primary.args = {
  isLoading: false,
  metadata: {
    icon: '',
    name: '',
    description: '',
    principal_id: Principal.fromText('aaaaa-aa'),
  } as any,
};

import React from 'react';
import { Story, Meta } from '@storybook/react';
import { styled } from '@stitched';
import ContainerBox from '.';

const Styled = styled('div', {
  fontFamily: 'Inter',
  color: '#FFFFFF',
});

export default {
  title: 'ContainerBox',
  component: ContainerBox,
} as Meta;

// eslint-disable-next-line react/prop-types
const Template: Story<any> = () => (
  <ContainerBox>
    <Styled>
      <p>Some content</p>
    </Styled>
  </ContainerBox>
);

export const Example = Template.bind({});

import React from 'react';
import { Story, Meta } from '@storybook/react';
import { styled } from '@stitched';
import InfoBox from '.';

const Wrapper = styled('div', {
  background: '#000',
  maxWidth: 500,
});

export default {
  title: 'InfoBox',
  component: InfoBox,
} as Meta;

// eslint-disable-next-line react/prop-types
const Template: Story<any> = () => (
  <Wrapper>
    <InfoBox
      label="Cycle balance"
      value={12500}
      id="cycles-balance"
      currency="ICP"
      showValueConversion
    />
  </Wrapper>
);

export const Example = Template.bind({});

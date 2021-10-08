import React from 'react';
import { Story, Meta } from '@storybook/react';
import TableDropDownSelect from '.';
import { styled } from '../../stitches.config';

const Container = styled('div', {
  width: '140px',
});

export default {
  title: 'TableDropDownSelect',
  component: TableDropDownSelect,
} as Meta;

const Template: Story<any> = () => (
  <Container>
    <TableDropDownSelect
      show
      title="Table Drop down options"
      options={['All', 'Lorem', 'Ipsum']}
      // eslint-disable-next-line no-console
      onSelectHandler={() => console.log('does something')}
      id="account-page-transactions"
    />
  </Container>
);

export const Example = Template.bind({});

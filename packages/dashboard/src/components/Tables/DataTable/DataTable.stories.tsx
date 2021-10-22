import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Column } from 'react-table';
import DataTable, { HeaderItem } from '.';
import { DEFAULT_COLUMN_ORDER } from '../TransactionsTable';
import { columns, generateData } from '../../../utils/mocks/transactionsTableMockData';

export default {
  title: 'DataTable',
  component: DataTable,
  argTypes: {
    columns: {
      control: 'object',
    },
    data: {
      control: {
        type: 'object',
      },
    },
  },
} as Meta;

const Columns = (columns as Column<HeaderItem>[]);
const data = generateData();

const Template: Story<any> = () => (
  <DataTable
    columns={Columns as any}
    data={data}
    columnOrder={DEFAULT_COLUMN_ORDER}
    isLoading={false}
    pageCount={1}
    fetchPageDataHandler={() => null}
  />
);

export const Chart = Template.bind({});

Chart.args = {
  columns: Columns,
  data,
};

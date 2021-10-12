/* eslint-disable import/prefer-default-export */

// account, transactions, age, cycles, icp

export const columns = [
  {
    Header: 'Canister',
    accessor: 'canister',
  },
  {
    Header: 'Transactions',
    accessor: 'transactions',
  },
  {
    Header: 'Age',
    accessor: 'age',
  },
];

export const data = [{
  canister: 'v3d55-22222-33333-44444-55555-66666-77777-8888',
  transactions: 1_000_000_000,
  age: '04/10/2021',
}, {
  canister: 'x0001-22222-33333-44444-55555-66666-77777-8888',
  transactions: 4_500,
  age: '12/08/2021',
}, {
  canister: 'y0002-22222-33333-44444-55555-66666-77777-8888',
  transactions: 165_106,
  age: '18/09/2020',
}, {
  canister: 'z0003-22222-33333-44444-55555-66666-77777-8888',
  transactions: 20_000,
  age: '01/01/2019',
}];

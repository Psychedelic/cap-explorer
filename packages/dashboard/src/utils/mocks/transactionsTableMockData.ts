/* eslint-disable import/prefer-default-export */

// to: Principal;
// fee: bigint;
// from: [] | [Principal];
// memo: number;
// time: bigint;
// operation: Operation;
// caller: Principal;
// amount: bigint;

export const columns = [
  {
    Header: 'Operation',
    accessor: 'operation',
  },
  {
    Header: 'Caller',
    accessor: 'caller',
  },
  {
    Header: 'From',
    accessor: 'from',
  },
  {
    Header: 'To',
    accessor: 'to',
  },
  {
    Header: 'Time',
    accessor: 'time',
  },
  {
    Header: 'Memo',
    accessor: 'memo',
  },
  {
    Header: 'Fee',
    accessor: 'fee',
  },
  {
    Header: 'Amount',
    accessor: 'amount',
  },
];

export const data = [{
  operation: 'deposit',
  caller: 'v3d55-22222-33333-44444-55555-66666-77777-8888',
  from: 'v3d55-22222-33333-44444-55555-66666-77777-8888',
  to: 'xoxo-22222-33333-44444-55555-66666-77777-xoxox',
  time: '02/06/2021',
  memo: 2142,
  amount: 484,
  fee: 50,
}, {
  operation: 'deposit',
  caller: 'z42321-22222-33333-44444-55555-66666-77777-8888',
  from: 'z42321-22222-33333-44444-55555-66666-77777-8888',
  to: 'ioio-22222-33333-44444-55555-66666-77777-xoxox',
  time: '02/04/2021',
  memo: 900,
  fee: 20,
  amount: 9000000,
}, {
  operation: 'withdraw',
  caller: 'z42321-22222-33333-44444-55555-66666-77777-8888',
  from: 'u3d55-22222-33333-44444-55555-66666-77777-8888',
  to: 'ioio-22222-33333-44444-55555-66666-77777-xoxox',
  time: '02/04/2021',
  memo: 150,
  fee: 35,
  amount: 1500,
}, {
  operation: 'deposit',
  caller: 'f52321-22222-33333-44444-55555-66666-77777-8888',
  from: 't6d55-22222-33333-44444-55555-66666-77777-8888',
  to: 'r5io-22222-33333-44444-55555-66666-77777-xoxox',
  time: '01/03/2021',
  memo: 50,
  fee: 235,
  amount: 25000000000,
}];

/* eslint-disable import/prefer-default-export */
import { isE2ETestRunner, qsE2ETestRunner } from './e2e';

const getTestQuery = () => (isE2ETestRunner() ? `?${qsE2ETestRunner}` : '');

export enum RouteNames {
  Overview = '/',
  AppTransactions = '/app-transactions/:id',
}

export const getRouteByName = (name: keyof typeof RouteNames, args?: { id: string }) => {
  let pathname = `${RouteNames[name]}${getTestQuery()}`;

  if (name === 'AppTransactions') {
    if (!args?.id) throw Error('Oops! Missing the route App ID.');

    pathname = pathname.replace(':id', args.id);
  }

  return pathname;
};

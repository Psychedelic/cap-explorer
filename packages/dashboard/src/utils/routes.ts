/* eslint-disable import/prefer-default-export */
import { isE2ETestRunner, qsE2ETestRunner } from './e2e';

const getTestQuery = () => (isE2ETestRunner() ? `?${qsE2ETestRunner}` : '');

export enum RouteNames {
  Home = '/',
}

export const getRouteByName = (name: keyof typeof RouteNames, args?: { id: string }) => {
  let pathname = `${RouteNames[name]}${getTestQuery()}`;

  return pathname;
};

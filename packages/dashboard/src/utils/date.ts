/* eslint-disable import/prefer-default-export */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extensions
[utc, timezone, relativeTime, customParseFormat].forEach((plugin) => dayjs.extend(plugin as any));

// Defaults
dayjs.tz.setDefault("Europe/London");

const USER_TIMEZONE = dayjs.tz.guess();

const NOW = new Date(
  new Date().toLocaleString("en-US", { timeZone: USER_TIMEZONE })
).toISOString();

export const dateRelative = (
  timestamp: string,
  now: string = NOW,
) => dayjs.utc(timestamp).from(now);

// (() => {
//   const timestamp = '2021-12-14T13:40:00.000Z';
//   const timeZone = 'Europe/London';
//   const localeTime = new Date(
//     new Date(timestamp).toLocaleString("en-US", { timeZone })
//   ).toISOString();
//   const res = dateRelative(timestamp, localeTime);
//   console.log('[debug] result eur/ldn', res);
// })();

// (() => {
//   const timestamp = '2021-12-14T13:40:00.000Z';
//   const timeZone = 'America/Los_Angeles';
//   const localeTime = new Date(
//     new Date(timestamp).toLocaleString("en-US", { timeZone })
//   ).toISOString();
//   const res = dateRelative(timestamp, localeTime);
//   console.log('[debug] result america/la', res);
// })();

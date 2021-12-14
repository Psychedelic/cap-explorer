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

const userTimezone = dayjs.tz.guess();

export const dateRelative = (timestamp: string) => dayjs.utc(timestamp).tz(userTimezone).fromNow();

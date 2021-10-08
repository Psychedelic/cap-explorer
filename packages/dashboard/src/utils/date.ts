/* eslint-disable import/prefer-default-export */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extensions
[utc, relativeTime, customParseFormat].forEach((plugin) => dayjs.extend(plugin));

export const dateRelative = (timestamp: string) => dayjs.utc(timestamp, 'DD/MM/YYYY').fromNow();

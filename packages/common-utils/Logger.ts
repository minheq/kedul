import pino from 'pino';

import { getOsEnv, isProduction } from './Environment';

export type Logger = pino.Logger;

export const makeLogger = (options?: pino.LoggerOptions): pino.Logger => {
  return pino({
    ...options,
    level: getOsEnv('LOGGER_LEVEL') || 'info',
    prettyPrint: !isProduction,
    base: null,
  });
};

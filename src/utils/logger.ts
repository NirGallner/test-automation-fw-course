import pino from 'pino';

export const logger = pino({
  name: 'clarivate-framework',
  level: 'debug',
  transport: process.env.CI
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true }
      }
});

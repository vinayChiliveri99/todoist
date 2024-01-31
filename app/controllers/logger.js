const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  transports: [
    new transports.File({
      level: 'warn',
      filename: 'loggerWarn.log',
    }),
    new transports.File({
      level: 'error',
      filename: 'loggerError.log',
    }),
    new transports.File({
      level: 'info',
      filename: 'loggerInfo.log',
    }),
  ],
  format: format.combine(
    format.json(),
    format.timestamp(),
    format.metadata(),
    format.prettyPrint()
  ),
});

module.exports = logger;

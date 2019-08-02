/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * https://sailsjs.com/docs/concepts/logging
 */
let commonSettings = {
  colorize: true,
  maxsize: 10000000,
  maxfiles: 10,
  json: false,
  
};

let settings = [
  {filename: `${__dirname}/../logs/warn.log`, level: 'warn'},
  {filename: `${__dirname}/../logs/error.log`, level: 'error'},
  {filename: `${__dirname}/../logs/debug.log`, level: 'debug'},
  {filename: `${__dirname}/../logs/info.log`, level: 'info', }
];

let {transports, createLogger, format} = require('winston');
let loggerSettings = {
  format: format.combine(
    format.timestamp({format:'MM-YY-DD HH:mm:ss'}),
    format.simple(),
    //format.prettyPrint()
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`+(info.stack!==undefined?`${info.stack.substring(0,900)}...`:" "))
),
  transports: [...settings.map(
    s => new transports.File({...s, ...commonSettings})), new transports.Console({
    format: format.combine(
      format.timestamp({format:'MM-YY-DD HH:mm:ss'}),
      format.simple(),
      //format.prettyPrint()
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`+(info.splat!==undefined?`${info.splat}`:" "))
  ),
    //  format: format.simple()
  })],
  exitOnError: false
};

// This is the workaround
let winstonLogger = createLogger(loggerSettings);
let logger = {
  'info': function () {
      winstonLogger.info(...arguments);
  },
  'debug': function () {
      winstonLogger.debug(...arguments);
  },
  'error': function () {
      winstonLogger.error(...arguments);
  },
  'warn': function () {
      winstonLogger.warn(...arguments);
  },
  'log': function () {
      winstonLogger.log(...arguments);
  }
};
// End of workaround
module.exports.log = {

  /***************************************************************************
  *                                                                          *
  * Valid `level` configs: i.e. the minimum log level to capture with        *
  * sails.log.*()                                                            *
  *                                                                          *
  * The order of precedence for log levels from lowest to highest is:        *
  * silly, verbose, info, debug, warn, error                                 *
  *                                                                          *
  * You may also set the level to "silent" to suppress all logs.             *
  *                                                                          *
  ***************************************************************************/

  // level: 'info'
  custom: logger,
  inspect: false
};

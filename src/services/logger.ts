import winston from 'winston'
import path from 'path'
import 'winston-daily-rotate-file'

let loggerCreation: winston.Logger

if (process.env.NODE_ENV === 'dev') {
  loggerCreation = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.cli(),
      winston.format.colorize(),
    ),
    transports: [
      new winston.transports.Console(),
    ],
  })
} else {
  loggerCreation = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.json(),
      winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
      winston.format.prettyPrint(),
    ),
    transports: [
      new winston.transports.File({
        filename: path.resolve('/', 'twitch-watcher', 'logs', 'error', 'errors.log'),
        level: 'error',
        maxsize: 1000000 * 5,
      }),
      new winston.transports.DailyRotateFile({
        filename: path.resolve('/', 'twitch-watcher',
          'logs', 'info', '%DATE%.log') as any,
        maxSize: 1000000 * 1,
        zippedArchive: true,
        maxFiles: '1d',
      }),
    ],
  })
}

const logger = loggerCreation

export default logger

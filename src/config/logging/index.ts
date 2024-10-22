import {format, transports, createLogger}  from 'winston';
import {config} from 'dotenv' ;
//import { Logtail }  from '@logtail/node';
//import { LogtailTransport } from '@logtail/winston' ;
//import { MongoDBTransportInstance,MongoDBConnectionOptions } from "winston-mongodb";
//import { config } from 'dotenv';
//const { MongoDB }: { MongoDB: MongoDBTransportInstance } = require("winston-mongodb");

config()
const { json, timestamp, errors, combine, metadata } = format
//config();

/*
 levels : {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}
 */

// const dbOptions = {
//     level: 'info',
//     collection: 'logs',
//     db: process.env.MONGO_STRING,
//     options: { useNewUrlParser: true, useUnifiedTopology: true },
//     handleExceptions: true,
//     capped: true,
//     includeIds: true,
//     format: combine(
//         errors({stack: true}),
//         timestamp({format: "YY-MM-DD HH:mm:ss"}),
//         json(),
//         format.printf((info) => {
//             const { level, message } = info;
//             return `[${level}] ${message}`;
//         })
//     )
// }

//const mongoTransport = new MongoDB({...dbOptions} as MongoDBConnectionOptions);

//const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

const activeTransports = process.env.NODE_ENV === 'production' ?
[
    // new LogtailTransport(logtail, {
    //     level: process.env.DEFAULT_LOG_LEVEL
    // }),
    // mongoTransport
    new transports.Console()
]
:
[
    new transports.Console()
]

const logConfig = createLogger({
    level: process.env.DEFAULT_LOG_LEVEL,
    format: combine(
        errors({stack: true}),
        timestamp({format: "YY-MM-DD HH:mm:ss"}),
        metadata(),
        format.printf((info) => {
            const { level, message } = info;
            return `[${level}] ${message}`;
        })
    ),
    transports: activeTransports
});

logConfig.exitOnError = false;

export default logConfig ;
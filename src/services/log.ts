import fs from 'fs';
import path from 'path';
import util from 'util';
import logConfig from '../config/logging';
import { ILogData } from '../models/interfaces';


const logger = {
    
    error: (data: ILogData) => {
        logConfig.error(`source =>  ${data.source}  &&  message => ${data.message}`,  data.meta)
    },
    warn:  (data: ILogData) => {
        logConfig.warn(`source =>  ${data.source}  &&  message => ${data.message}`,  data.meta)
    },
    info: (data: ILogData) => {
        logConfig.info(`source =>  ${data.source}  &&  message => ${data.message}`,  data.meta)
    },
    http: (data: ILogData) => {
        logConfig.http(`source =>  ${data.source}  &&  message => ${data.message}`,  data.meta)
    },
    verbose: (data: ILogData) => {
        logConfig.verbose(`source =>  ${data.source}  &&  message => ${data.message}`,  data.meta)
    },
    debug: (data: ILogData) => {
        logConfig.debug(`source =>  ${data.source}  &&  message => ${data.message}`,  data.meta)
    },
    silly: (data: ILogData) => {
        logConfig.silly(`source =>  ${data.source}  &&  message => ${data.message}`,  data.meta)
    }
}

const localLog = {
    log: (...args: any[]) => {

        // Path to the log file
        const logFilePath = path.join(process.cwd(), 'dist','public', 'logs', 'pm2.log'); 
        const formattedMessage = util.format(...args);
        
        fs.appendFile(logFilePath, `${new Date().toISOString()} - ${formattedMessage}\n`, 'utf8', err => {
            if (err) {
                console.error('localLog -> failed to save to log file', err);
            }
        });
        
        // Also print to the console as normal, so you don't lose output in the terminal
        process.stdout.write(formattedMessage + '\n'); 
    }
}
export {logger, localLog} ;
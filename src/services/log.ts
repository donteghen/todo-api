
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

export default logger ;
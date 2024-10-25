import { config } from 'dotenv';
import cluster from 'cluster';
import os from 'os';
import { appendFile, writeFile } from 'fs';

// local imports
import { connectDb } from './config/db';
import {localLog, logger} from './services/log';
import path from 'path';

// initialization
config();
const PORT = process.env.PORT;
const prodEnv: boolean = process.env.NODE_ENV === 'production' ;

if (prodEnv) {

    const cpuCount = os.cpus.length;

    if (cluster.isPrimary) {

        for (let i = 0; i <= cpuCount; i++) {
            const worker = cluster.fork();

            worker.on('exit', (code, signal) => {
                if (signal) {
                    if (prodEnv) {
                        logger.error({source: 'index.ts', message: `⚠️worker ${worker.process.pid} was killed by signal: ${signal}`});
                    }
                    localLog.log(JSON.stringify({source: 'index.ts', message: `⚠️worker ${worker.process.pid} was killed by signal: ${signal}`}));
                } else if (code !== 0) {
                    if (prodEnv) {
                        logger.info({source: 'index.ts', message:`⚠️worker ${worker.process.pid} exited with code: ${code}`});
                    }
                    localLog.log({source: 'index.ts', message:`⚠️worker ${worker.process.pid} exited with code: ${code}`})
                } else {
                    if (prodEnv) {
                        logger.info({source: 'index', message:`✅worker ${worker.process.pid} success!`});
                    }
                    localLog.log(JSON.stringify({source: 'index', message:`✅worker ${worker.process.pid} success!`}));
                }
                cluster.fork();
            });
        }
    }
    else {
        init(process.pid);
    }
}
else {
    init(1);
}


/**
 * Function initializes an new server for a given worker
 * @param workerId
 */
function init( workerId: number ) {
    initLocalLogging().then(() => {
        if (prodEnv) {
            logger.info({source: 'index.ts -> init', message: '********* Starting up the server *********'});
            logger.info({source: 'index.ts -> init', message: `Worker ${workerId} Initializing DB connection...`});
        }
        localLog.log('********* Starting up the server *********');
        localLog.log(`Worker ${workerId} Initializing DB connection...`);

    // start server
        connectDb()
        .then(async () => {
            if (prodEnv) {
                logger.info({source: 'index.ts -> init', message: 'The database has been connected successfully ✅'});
            }
            localLog.log(JSON.stringify({source: 'index.ts -> init', message: 'The database has been connected successfully ✅'}))
            const {app} = await import('./server');
            app.listen(PORT, () => {
                if (prodEnv) {
                    logger.info({source:'index.ts -> init', message: `⚡️Server started by Worker ${workerId} is up & listining at: http://localhost:${PORT}`});
                }
                localLog.log(`Worker ${workerId} is up & listining at: http://localhost:${PORT}`);
            })
            .setTimeout(12000);
        })
        .catch(error => {
            if (prodEnv) {
                logger.error({source:'index -> init', message:`⚠️${new Date(Date.now()).toLocaleString()} " : Server failed to initialize`, meta: error});
            }
            localLog.log(`index -> init ${new Date(Date.now()).toLocaleString()} " : Server failed to initialize`, error);
        })
    });
    
}

async function initLocalLogging () {
    const logFilePath = path.join(process.cwd(), 'dist', 'public', 'logs', 'pm2.log');
    writeFile(logFilePath, '', 'utf8', err => {
        if (err) {
            if (prodEnv) {
                logger.error({source: 'index.ts -> initLocalLogging', message: 'Couldn\'t empty the logfile!', meta: err})
            }            
            localLog.log(JSON.stringify({source: 'index.ts -> initLocalLogging', message: 'Couldn\'t empty the logfile!', meta: err}))
        }
    });
}
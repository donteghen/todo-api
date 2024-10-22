import { config } from 'dotenv';
import cluster from 'cluster';
import os from 'os';


// local imports
import { connectDb } from './config/db';
import logger from './services/log';

// initialization
config();
const PORT = process.env.PORT;
const prodEnv: boolean = process.env.NODE_ENV === 'development' ;

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
                    //console.log(`worker ${worker.process.pid} was killed by signal: ${signal}`);
                } else if (code !== 0) {
                    if (prodEnv) {
                        logger.info({source: 'index.ts', message:`⚠️worker ${worker.process.pid} exited with code: ${code}`});
                    }
                    //console.log('index', `worker ${worker.process.pid} exited with code: ${code}`);
                } else {
                    if (prodEnv) {
                        logger.info({source: 'index', message:`✅worker ${worker.process.pid} success!`});
                    }
                    //console.log('worker success!');
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
    logger.info({source: 'index.ts -> init', message: '********* Starting up the server *********'});
    logger.info({source: 'index.ts -> init', message: `Worker ${workerId} Initializing DB connection...`});

    // start server
    connectDb()
    .then(async () => {
        //console.log('');
        logger.info({source: 'index.ts -> init', message: 'The database has been connected successfully ✅'});
        const {app} = await import('./server');
        app.listen(PORT, () => {
            if (prodEnv) {
                logger.info({source:'index.ts -> init', message: `⚡️Server started by Worker ${workerId} is up & listining at: http://localhost:${PORT}`});
            }
            //console.log(`Worker ${workerId} is up & listining at: http://localhost:${PORT}`);
        })
        .setTimeout(12000);
    })
    .catch(error => {
        if (prodEnv) {
            logger.error({source:'index -> init', message:`⚠️${new Date(Date.now()).toLocaleString()} " : Server failed to initialize`, meta: error});
        }
        //console.error(`index -> init ${new Date(Date.now()).toLocaleString()} " : Server failed to initialize`, error);
    })
}
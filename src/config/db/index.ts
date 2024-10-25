import {connection, connect} from 'mongoose';
import {config} from 'dotenv' ;
import {localLog, logger} from '../../services/log';

config();

const prodEnv = process.env.NODE_ENV === 'production';
const mongo_srv = process.env.MONGO_STRING;
export const connectDb = async () => {
    connection.on('connected', () => {
        if (prodEnv) {
            logger.info({source:'config/db/index.ts',  message: 'MONGODB Connection Established', meta: null})
        }
        localLog.log(JSON.stringify({source:'config/db/index.ts',  message: 'MONGODB Connection Established', meta: null}));
    });
    connection.on('error', (error) => {
        if (prodEnv) {
            logger.error({source:'config/db/index.ts',  message: 'connectDb A db connection error occured!', meta: error})
        }
        localLog.log(JSON.stringify({source:'config/db/index.ts',  message: 'connectDb A db connection error occured!', meta: error}));
    })
    connection.on('reconnected', () => {
        if (prodEnv) {
            logger.info({source:'config/db/index.ts',  message: 'MONGODB Connection Reestablished', meta: null})
        }
        localLog.log(JSON.stringify({source:'config/db/index.ts',  message: 'MONGODB Connection Reestablished', meta: null}));
    });

    connection.on('disconnected', () => {
        if (prodEnv) {             
            logger.error({source:'config/db/index.ts',  message: 'MONGODB Connection Disconnected', meta: null})
        }
        localLog.log(JSON.stringify({source:'config/db/index.ts',  message: 'MONGODB Connection Disconnected', meta: null}));
    });

    connection.on('close', () => {
        if (prodEnv) {
            logger.error({source:'config/db/index.ts',  message: 'MONGODB Connection Closed', meta: null})
        }
        localLog.log(JSON.stringify({source:'config/db/index.ts',  message: 'MONGODB Connection Closed', meta: null}));
    });
    await connect(mongo_srv);
}


export async function closeDb() {
    if (!connection) {
        return
    }
    await connection.close()
}
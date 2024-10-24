import {connection, connect} from 'mongoose';
import {config} from 'dotenv' ;
import logger from '../../services/log';

config();

const prodEnv = process.env.NODE_ENV === 'development';
const mongo_srv = process.env.MONGO_STRING;
export const connectDb = async () => {
    connection.on('connected', () => {
        if (!prodEnv) {
            logger.info({source:'config/db/index.ts',  message: 'MONGODB Connection Established', meta: null})
        }
    });
    connection.on('error', (error) => {
        if (prodEnv) {
            logger.error({source:'config/db/index.ts',  message: 'connectDb A db connection error occured!', meta: error})
        }
        // else {
        //     console.log(`A db error occured : ${error?.message??"Unknown"}`)
        // }
    })
    connection.on('reconnected', () => {
        if (!prodEnv) {
            logger.info({source:'config/db/index.ts',  message: 'MONGODB Connection Reestablished', meta: null})
        }
    });

    connection.on('disconnected', () => {
        if (!prodEnv) {             
            logger.error({source:'config/db/index.ts',  message: 'MONGODB Connection Disconnected', meta: null})
        }
        //   else {
        //        console.log('MONGODB Disconnected!');
        //   }
    });

    connection.on('close', () => {
        if (prodEnv) {
            logger.error({source:'config/db/index.ts',  message: 'MONGODB Connection Closed', meta: null})
        }
        // else {
        //     console.log('MONGODB Connection Closed');
        // }
    });
    await connect(mongo_srv);
}


export async function closeDb() {
    if (!connection) {
        return
    }
    await connection.close()
}
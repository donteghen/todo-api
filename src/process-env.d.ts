import { IUser } from "./models/interfaces";

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string;
        PORT: string;
        NODE_ENV: string
        MONGO_STRING:string
        LOGTAIL_SOURCE_ID: string
        LOGTAIL_SOURCE_TOKEN: string
        DEFAULT_LOG_LEVEL: string
        // add more environment variables and their types here
      }
    }

    namespace Express {
      export interface Request {
        user: any
      }
   }
}
export {} 
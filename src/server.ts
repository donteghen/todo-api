import express, {Request, Response} from 'express';
import {connection} from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { routes } from './routes';
import cors from 'cors';
import {config} from 'dotenv' ;
import {localLog, logger} from './services/log';
import {errorOptions} from './data/index'
import path from 'path';

config();

const app = express();
const port = process.env.PORT ||8000;
const prodEnv = process.env.NODE_ENV = 'developmet';

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Load routes from routes/index.js
routes.forEach((route) => {
  app.use(route.path, route.router);
});


// initialize routes
localLog.log('Initializing Routes...');
routes.forEach(({path, router}) => {
    if (prodEnv) {
      logger.info({source:'server.js', message: `loading route : ${path}`, meta: null})
    }
    localLog.log(JSON.stringify({source:'server.js', message: `loading route : ${path}`, meta: null}))
    app.use(router);
})
localLog.log('*** Route Initialization Completed ***');

// Serve the PM2 UI HTML
app.get('/processes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

//  Health check route
app.get('/api/healthz', async (req: Request, res: Response) => {
    try {
        const entityCount = (await connection?.db?.collections())?.length;

      res.json({ok: true, message: `server -> heath-check router endpoint. Api is up and running & DB has ${entityCount} entities`});
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        logger.error({source: 'server -> heathz router endpoint', message: `⛔️${errorOptions.healthCheckFailed.message}`, meta: error});
      }
      res.status(400).send(errorOptions.healthCheckFailed);
    }
})

// Swagger documentation route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export {app};
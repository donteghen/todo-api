import swaggerJSDoc from 'swagger-jsdoc';
import { routes } from '../../routes';
import path from 'path';


const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TODO API Documentation',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Development server',
    },
  ],
};

const routeSrc = path.join(process.cwd(), 'src', 'routes')
const options = {
  swaggerDefinition,
  apis: routes.map((route) => `${routeSrc}${route.filePath}.ts`), 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

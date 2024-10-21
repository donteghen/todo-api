import swaggerJSDoc from 'swagger-jsdoc';
import { routes } from '../../routes';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TODO API Documentation',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
  ],
};


const options = {
  swaggerDefinition,
  apis: routes.map((route) => `./routes/${route.path}.js`), 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

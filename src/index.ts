import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { routes } from './routes';
import cors from 'cors';

const app = express();
const port = process.env.PORT ||8000;

// Middleware setup
app.use(express.json());
app.use(cors());

// Load routes from routes/index.js
routes.forEach((route) => {
  app.use(route.path, route.router);
});

// Swagger documentation route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

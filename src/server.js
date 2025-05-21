import pinoHttp from 'pino-http';
import express from 'express';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const PORT =  Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  
const app = express();

app.use(cors());

app.use(express.json());

app.use(pinoHttp({
    transport: {
      target: 'pino-pretty',
    }
  })
);

app.use(contactsRouter); 

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
};
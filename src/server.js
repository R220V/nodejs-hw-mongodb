import * as fs from "node:fs";
import path from 'node:path';
import pinoHttp from 'pino-http';
import express from 'express';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routes/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';
import { authenticate } from './middlewares/authenticate.js';
import swaggerUI from "swagger-ui-express"; 
import routes from'./routes/index.js';


const SWAGGER_DOCUMENT =JSON.parse(fs.readFileSync(path.join("docs", "swagger.json"),"utf-8"));

const PORT =  Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  
const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(SWAGGER_DOCUMENT));

//віддамо на фронт аватарку
app.use("/photo", express.static(path.resolve("src","uploads","photo")));

app.use(pinoHttp({
    transport: {
      target: 'pino-pretty',
    }
  })
);

app.use('/auth', authRouter);

app.use('/', authenticate, contactsRouter);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server started at: http://localhost:${PORT}`);
});
};
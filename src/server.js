import path from 'node:path';
import express from 'express';
import cors from 'cors';
import routes from './routers/index.js';
import cookieParser from 'cookie-parser';
/* import pino from 'pino-http';  */
import { env } from './utils/env.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use('/photos', express.static(path.resolve('src', 'public/photos')));

  app.use(cookieParser());

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
    }),
  );

  // Налаштовуємо CORS middleware для обробки запитів з інших доменів
  app.use(cors());

  // Налаштовуємо Pino для логування запитів
  /*  app.use(
    pino({
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:standard',
          colorize: true,
          levelFirst: true,
          ignore: 'pid,hostname',
          errorProps: 'stack',
        },
      },
    }),
  ); */

  app.use('/', routes);

  // Роут для кореневого запиту
  app.get('/', (req, res) => {
    res.json({
      message: 'Server is enable',
    });
  });

  // Обробка неіснуючих роутів (404 помилка)
  app.use('*', notFoundHandler);

  // Обробка помилок (500 помилка)
  app.use(errorHandler);

  // Запускаємо сервер
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

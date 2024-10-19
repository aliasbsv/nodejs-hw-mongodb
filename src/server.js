import express from 'express';
import cors from 'cors'; // CORS для керування доступом до ресурсів з інших доменів
import pino from 'pino-http'; // Pino для логування запитів
import { env } from './utils/env.js';
import router from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
    }),
  );

  // Налаштовуємо middleware для обробки JSON
  //app.use(express.json());

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

  // Роут для кореневого запиту
  app.get('/', (req, res) => {
    res.json({
      message: 'Server is enable',
    });
  });

  // Додаємо роутер до app як middleware
  app.use(router);

  // Обробка неіснуючих роутів (404 помилка)
  app.use('*', notFoundHandler);

  // Обробка помилок (500 помилка)
  app.use(errorHandler);

  // Запускаємо сервер
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

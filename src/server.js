import express from 'express';
import cors from 'cors'; // CORS для керування доступом до ресурсів з інших доменів
import pino from 'pino-http'; // Pino для логування запитів
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './service/contacts.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  // Налаштовуємо middleware для обробки JSON
  app.use(express.json());
  // Налаштовуємо CORS middleware для обробки запитів з інших доменів
  app.use(cors());

  // Налаштовуємо Pino для логування запитів
  app.use(
    pino({
      level: 'info', // Устанавливаем уровень логирования (info, debug, error и т.д.)
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:standard', // Читаемые временные метки
          colorize: true, // Включаем цветную схему
          levelFirst: true, // Показ уровня логирования первым
          ignore: 'pid,hostname', // Убираем ненужные поля pid и hostname
          errorProps: 'stack', // Показываем стек ошибок
        },
      },
    }),
  );

  //Створюємо 2 маршрути для GET-запитів
  app.get('/contacts', async (req, res, next) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts',
        data: contacts,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    try {
      const contact = await getContactById(contactId);
      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  });

  // Роут для кореневого запиту
  app.get('/', (req, res) => {
    res.json({
      message: 'Server is enable',
    });
  });

  // Обробка неіснуючих роутів (404 помилка)
  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  // Обробка помилок (500 помилка)
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  // Запускаємо сервер
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

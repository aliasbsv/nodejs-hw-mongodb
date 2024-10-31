import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../service/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

/*  Контроллер для получения всех контактов с поддержкой фильтрации, пагинации и сортировки. */
export const getContactsController = async (req, res) => {
  // Извлечение параметров пагинации, сортировки и фильтрации из запроса
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;
  // Получение всех контактов с применением параметров запроса
  const data = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

/* Контроллер для получения конкретного контакта по ID. */
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  console.log('Contact ID:', contactId); // Логирование ID контакта
  console.log('User ID:', userId); // Логирование ID пользователя

  // Получение контакта по ID и userId для проверки прав доступа
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    // Если контакт не найден, возвращаем ошибку 404
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

/* Контроллер для создания нового контакта.*/
export const createContactController = async (req, res) => {
  const userId = req.user._id;

  // Добавление userId к данным нового контакта
  const newContact = { ...req.body, userId };
  const contact = await createContact(newContact);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

/* Контроллер для удаления контакта по ID. */
export const deleteContactController = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;
  // Удаление контакта по userId и contactId для проверки прав доступа
  const contact = await deleteContact(contactId, userId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};

/* Контроллер для обновления существующего контакта по ID. */
export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const payload = req.body;
  const userId = req.user._id;
  // Обновление контакта по contactId, userId и новым данным
  const updatedContact = await updateContact(contactId, payload, userId);
  if (!updatedContact) {
    // Если контакт не найден, возвращаем ошибку 404
    throw createHttpError(404, 'Contact not found');
  }
  // Возвращение успешного ответа с обновленными данными контакта
  res.json({
    status: 200,
    message: 'Successfully updated the contact!',
    data: updatedContact,
  });
};

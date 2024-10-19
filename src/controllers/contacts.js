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

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;

  const contact = await getContactById(id);
  // Проверяем, существует ли  контакт с таким Id, если нет, возвращаем ошибку 404
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  if (
    typeof req.body.name === 'undefined' ||
    typeof req.body.phoneNumber === 'undefined' ||
    typeof req.body.contactType === 'undefined'
  ) {
    throw createHttpError(400, 'Request body is not valid');
  }

  if (['work', 'home', 'personal'].includes(req.body.contactType) !== true) {
    throw createHttpError(400, 'contactType is not valid');
  }

  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const contactReqBody = { name, phoneNumber, email, isFavourite, contactType };
  const newContact = await createContact(contactReqBody);
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: newContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;

  const contact = await deleteContact(id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const updatedContact = { name, phoneNumber, email, isFavourite, contactType };

  const result = await updateContact(id, updatedContact);
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched the contact!',
    data: result,
  });
};

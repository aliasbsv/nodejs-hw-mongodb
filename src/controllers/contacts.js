import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../service/contacts.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  // Проверяем, является ли contactId валидным Id, если нет, возвращаем ошибку 400
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID format'));
  }
  const contact = await getContactById(contactId);
  // Проверяем, существует ли  контакт с таким Id, если нет, возвращаем ошибку 404
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const contactReqBody = { name, phoneNumber, email, isFavourite, contactType };
  const newContact = await createContact(contactReqBody);
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: newContact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  // Проверка на валидность ObjectId
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID format'));
  }
  const contact = await deleteContact(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  /*   res.status(204).send(`Contact successfully with id: deleted`); */
  res.json({
    status: 204,
    message: `Contact successfully deleted`,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const updatedContact = { name, phoneNumber, email, isFavourite, contactType };

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID format'));
  }
  const result = await updateContact(contactId, updatedContact);
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched the contact!',
    data: result,
  });
};

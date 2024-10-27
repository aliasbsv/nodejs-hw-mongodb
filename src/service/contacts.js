import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filter, userId }) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  // Создаем запрос с помощью метода `find()`
  const contactsQuery = ContactsCollection.find().where('userId').equals(userId);

  // Применяем фильтрацию по `contactType`, если она задана
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  const [total, data] = await Promise.all([
    ContactsCollection.countDocuments(contactsQuery.getFilter()),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);
  return {
    data,
    page,
    perPage,
    totalItems: total,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages - page > 0,
  };
};

export const getContactById = async (userId, contactId) => {
  const contact = await ContactsCollection.findById(contactId).where('userId').equals(userId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const deleteContact = async (userId, contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId: userId,
  });
  return contact;
};

export const updateContact = async (userId, id, payload, options) => {
  const rawResult = await ContactsCollection.findByIdAndUpdate(
    { _id: id, userId: userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

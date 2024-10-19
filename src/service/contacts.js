import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filter }) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  // Создаем запрос с помощью метода `find()`
  const contactsQuery = ContactsCollection.find();

  // Применяем фильтрацию по `contactType`, если она задана
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  const [total, contacts] = await Promise.all([
    ContactsCollection.countDocuments(contactsQuery.getFilter()),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);
  return {
    contacts,
    page,
    perPage,
    totalItems: total,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages - page > 0,
  };
};

/* export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filter }) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const query = {};


  if (filter.contactType) {
    query.contactType = filter.contactType;
  }

  const contactsQuery = ContactsCollection.find();
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  const [total, contacts] = await Promise.all([
    ContactsCollection.countDocuments(contactsQuery),
    ContactsCollection.find(contactsQuery)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);
  return {
    contacts,
    page,
    perPage,
    totalItems: total,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages - page > 0,
  };
}; */

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });
  return contact;
};

export const updateContact = async (id, updates) => {
  const contact = await ContactsCollection.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  return contact;
};

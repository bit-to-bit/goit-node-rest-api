import { Contact } from "../db/Contact.js";

export const listContacts = async () => await Contact.findAll();

export const getContactById = async (contactId) =>
  (await Contact.findByPk(contactId)) || null;

export const addContact = async (data) => await Contact.create(data);

export const updateContact = async (contactId, data) => {
  const contact = await getContactById(contactId);
  if (contact) {
    await contact.update(data);
    await contact.save();
  }
  return contact;
};

export const updateStatusContact = async (contactId, body) => {
  return await updateContact(contactId, body);
};

export const removeContact = async (contactId) => {
  const contact = await getContactById(contactId);
  if (contact) {
    await contact.destroy();
  }
  return contact;
};

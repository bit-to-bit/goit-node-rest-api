import { Contact } from "../db/Contact.js";

export const listContacts = async (owner) =>
  await Contact.findAll({ where: { owner: owner } });

export const getContactById = async (contactId, owner) =>
  (await Contact.findOne({ where: { id: contactId, owner: owner } })) || null;

export const addContact = async (data, owner) =>
  await Contact.create({ ...data, owner });

export const updateContact = async (contactId, data, owner) => {
  const contact = await getContactById(contactId, owner);
  if (contact) {
    await contact.update(data);
    await contact.save();
  }
  return contact;
};

export const updateStatusContact = async (contactId, body, owner) => {
  return await updateContact(contactId, body, owner);
};

export const removeContact = async (contactId, owner) => {
  const contact = await getContactById(contactId, owner);
  if (contact) {
    await contact.destroy();
  }
  return contact;
};

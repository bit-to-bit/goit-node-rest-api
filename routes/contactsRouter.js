import express from "express";
import validateBody from "../middlewares/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), updateContact);

contactsRouter.patch(
  "/:contactId/favorite",
  validateBody(updateContactSchema),
  updateStatusContact
);

export default contactsRouter;

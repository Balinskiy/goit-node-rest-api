import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema, updateContactStatusSchema } from "../schemas/contactsSchemas.js";
import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";
import isValidBody from "../middlewares/isValidBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, getOneContact);

contactsRouter.delete("/:id", authenticate, isValidId, deleteContact);

contactsRouter.post("/", authenticate, isValidBody, validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", authenticate, isValidBody, isValidId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", authenticate, isValidBody, isValidId, validateBody(updateContactStatusSchema), updateStatusContact);

export default contactsRouter;

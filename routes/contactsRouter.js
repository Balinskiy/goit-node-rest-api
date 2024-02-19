import express from "express";
import { getAllContacts, getOneContact, deleteContact, createContact, updateContact } from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody, createContact);

contactsRouter.put("/:id", validateBody, updateContact);

export default contactsRouter;

import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import { addContact, getContactById, removeContact, updateById } from "../services/contactsServices.js";
import Contact from "../models/contacts.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    console.log(req.params.id);

    const { id } = req.params;
    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await removeContact(id);
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { name, email, phone } = req.body;
    const result = await Contact.create({ name, email, phone });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const updateItem = req.body;
    const result = await updateById(id, updateItem);

    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// export const getAllContacts = async (req, res, next) => {
//   try {
//     const result = await listContacts();
//     res.json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getOneContact = async (req, res, next) => {
//   try {
//     console.log(req.params.id);

//     const { id } = req.params;
//     const result = await getContactById(id);
//     if (!result) {
//       throw HttpError(404);
//     }
//     res.json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteContact = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const result = await removeContact(id);
//     if (!result) {
//       throw HttpError(404);
//     }
//     res.json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// export const createContact = async (req, res, next) => {
//   try {
//     const { error } = createContactSchema.validate(req.body);
//     if (error) {
//       throw HttpError(400, error.message);
//     }
//     const { name, email, phone } = req.body;
//     const result = await addContact(name, email, phone);
//     res.status(201).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateContact = async (req, res, next) => {
//   try {
//     if (Object.keys(req.body).length === 0) {
//       throw HttpError(400, "Body must have at least one field");
//     }
//     const { error } = updateContactSchema.validate(req.body);
//     if (error) {
//       throw HttpError(400, error.message);
//     }
//     const { id } = req.params;
//     const updateItem = req.body;
//     const result = await updateById(id, updateItem);

//     if (!result) {
//       throw HttpError(404);
//     }
//     res.json(result);
//   } catch (error) {
//     next(error);
//   }
// };

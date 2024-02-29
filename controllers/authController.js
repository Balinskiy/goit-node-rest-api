import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";

const register = async (req, res, next) => {
  const { password, email } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ password: hashPassword, email: normalizedEmail });

    res.status(201).json({
      user: {
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { password, email } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }
    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    res.json({ message: "Login successful" });
  } catch (error) {
    next(error);
  }
};

export default { register, login };

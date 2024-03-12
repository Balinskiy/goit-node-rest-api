import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import * as fs from "node:fs/promises";
import * as path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";

const register = async (req, res, next) => {
  const { password, email } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(normalizedEmail, { s: "250", r: "pg", d: "404" }, true);
    const newUser = await User.create({ password: hashPassword, email: normalizedEmail, avatarUrl: avatarUrl });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarUrl: newUser.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { password, email } = req.body;

  if (!email || !password) {
    return next(HttpError(400, "Missed required email or password field"));
  }

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

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1 days" }
    );

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token: token,
      user: {
        email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    res.json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const getAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.avatar) {
      throw HttpError(404, "User or Avatar not found");
    }
    res.sendFile(path.join(process.cwd(), "public/avatars", user.avatar));
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const newFilename = req.file.filename;
    await fs.rename(req.file.path, path.join(process.cwd(), "public/avatars", newFilename));

    const imagePath = path.join(process.cwd(), "public/avatars", newFilename);
    const image = await Jimp.read(imagePath);

    await image.resize(250, 250);
    await image.writeAsync(imagePath);

    const user = await User.findByIdAndUpdate(req.user._id, { avatar: newFilename }, { new: true });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export default { register, login, getCurrent, logout, updateAvatar, getAvatar };

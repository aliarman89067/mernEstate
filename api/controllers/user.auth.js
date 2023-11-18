import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";
import listingModel from "../models/listing.model.js";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const alreadyUser = await userModel.findOne({ email });
    if (alreadyUser) {
      next(errorHandler(401, "This Email is Already Used"));
    } else {
      const hashedPassword = bcryptjs.hashSync(password, 10);
      const createUser = await userModel.create({
        username,
        email,
        password: hashedPassword,
      });
      res.status(201).json(createUser);
    }
  } catch (error) {
    next(error);
  }
};

export const logIn = async (req, res, next) => {
  const { email, password } = req.body;
  const userDoc = await userModel.findOne({ email });
  if (!userDoc) {
    next(errorHandler(404, "User Not Found!"));
  } else {
    const userPassword = bcryptjs.compareSync(password, userDoc.password);
    if (!userPassword) {
      next(errorHandler(404, "Password Is Not Correct!"));
    } else {
      const { password: pass, ...rest } = userDoc._doc;
      const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    }
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const { access_token } = req.cookies;
    if (access_token) {
      jwt.verify(access_token, process.env.JWT_SECRET, (err, userData) => {
        if (err) {
          return next(errorHandler(401, "Token is not valid"));
        }
        res.status(200).json("User is Authenticated");
      });
    } else {
      res.status(200).json("cookie not found");
    }
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  const { username, email, photo } = req.body;
  try {
    const userDoc = await userModel.findOne({ email });
    if (userDoc) {
      const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = userDoc._doc;
      res.status(200).cookie("access_token", token).json(rest);
    } else {
      const randomPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(randomPassword, 10);
      const newUser = await userModel.create({
        username,
        email,
        photo,
        password: hashedPassword,
      });
      const { password: pass, ...rest } = newUser._doc;
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      res.status(201).cookie("access_token", token).json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { username, email, photo } = req.body;
  try {
    const { access_token } = req.cookies;
    if (!access_token) return next(errorHandler(401, "User Not Authorized"));
    jwt.verify(access_token, process.env.JWT_SECRET, async (err, userData) => {
      if (err) return next(errorHandler(400, "Token is Not Valid"));
      const alreadyUser = await userModel.findOne({
        email,
        _id: { $ne: userData.id },
      });
      if (alreadyUser) {
        return next(errorHandler(401, "This Email Already Used"));
      }
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
      const updatedUser = await userModel.findByIdAndUpdate(
        userData.id,
        {
          $set: {
            username,
            email,
            password: req.body.password,
            photo,
          },
        },
        { new: true }
      );
      const { password: pass, ...rest } = updatedUser._doc;
      res.status(201).json(rest);
    });
  } catch (error) {
    next(error);
  }
};
export const signOut = async (req, res, next) => {
  try {
    res.status(200).clearCookie("access_token").json("Cookie Delete");
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(errorHandler(404, "User Id Not Found!"));
    await userModel.findByIdAndDelete(id);
    res.status(200).json("User Deleted");
  } catch (error) {
    next(error);
  }
};
export const getUser = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const userDoc = await userModel.findById(req.params.id);
    res.status(200).json(userDoc);
  } catch (error) {
    next(error);
  }
};
export const likePlace = async (req, res, next) => {
  const id = req.body.id;
  try {
    const { access_token } = req.cookies;
    jwt.verify(access_token, process.env.JWT_SECRET, async (err, userData) => {
      if (err) return next(errorHandler(401, "Token is Not Valid"));
      const userDoc = await userModel.findById(userData.id);
      const placeLiked = await userDoc.favourite.includes(id);
      console.log(placeLiked);
      if (placeLiked) {
        await userModel.findByIdAndUpdate(userData.id, {
          $pull: { favourite: id },
        });
        res.status(201).json("Like Removed");
      } else {
        await userModel.findByIdAndUpdate(userData.id, {
          $push: { favourite: id },
        });
        res.status(201).json("Like Added");
      }
    });
  } catch (error) {
    next(error);
  }
};
export const getLikedId = async (req, res, next) => {
  try {
    const { access_token } = req.cookies;
    jwt.verify(access_token, process.env.JWT_SECRET, async (err, userData) => {
      if (err) return next(errorHandler(400, "Token is not Valid!"));
      const userDoc = await userModel.findById(userData.id);
      res.status(200).json(userDoc.favourite);
    });
  } catch (error) {
    next(error);
  }
};
export const deleteFavourite = async (req, res, next) => {
  console.log("Hello World");
  try {
    const { access_token } = req.cookies;
    jwt.verify(access_token, process.env.JWT_SECRET, async (err, userData) => {
      if (err) return next(errorHandler(400, "Token is not Valid!"));
      await userModel.findByIdAndUpdate(userData.id, {
        $pull: { favourite: req.body.id },
      });
      res.status(200).json("Ok");
    });
  } catch (error) {
    next(error);
  }
};

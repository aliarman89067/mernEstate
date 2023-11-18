import listingModel from "../models/listing.model.js";
import userModel from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const createListing = async (req, res, next) => {
  try {
    const {
      title,
      address,
      description,
      type,
      parking,
      furnished,
      bedRooms,
      bathRooms,
      offer,
      regularPrice,
      discountPrice,
      imageUrl,
    } = req.body;
    const { access_token } = req.cookies;
    if (!access_token)
      return next(errorHandler(404, "User Not Authenticated!"));
    jwt.verify(access_token, process.env.JWT_SECRET, async (err, userData) => {
      if (err) return next(errorHandler(401, "Token is not Valid!" + err));
      const listingDoc = await listingModel.create({
        userRef: userData.id,
        title,
        address,
        description,
        type,
        parking,
        furnished,
        bedRooms,
        bathRooms,
        offer,
        regularPrice,
        discountPrice,
        imageUrl,
      });
      res.status(201).json(listingDoc);
    });
  } catch (error) {
    next(error);
  }
};
export const getListing = async (req, res, next) => {
  try {
    const listingsDoc = await listingModel.find({ userRef: req.user.id });
    res.status(200).json(listingsDoc);
  } catch (error) {
    next(error);
  }
};
export const listById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listingDoc = await listingModel.findOne({ _id: id });
    res.status(200).json(listingDoc);
  } catch (error) {
    next(error);
  }
};
export const updateListing = async (req, res, next) => {
  const { id, ...rest } = req.body;
  try {
    const userDoc = await listingModel.findByIdAndUpdate(id, {
      $set: { ...rest },
    });
    res.status(201).json(userDoc);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  try {
    await listingModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted");
  } catch (error) {
    next(error);
  }
};
export const listingInfo = async (req, res, next) => {
  try {
    const listingDoc = await listingModel.findById(req.params.id);
    res.status(200).json(listingDoc);
  } catch (error) {
    next(error);
  }
};
export const searchListing = async (req, res, next) => {
  try {
    console.log(req.query.type);
    let searchText = req.query.searchText || "";
    let type = req.query.type || "all";
    if (type === "undefined" || type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    let furnished = req.query.furnished || false;
    if (
      furnished === "false" ||
      furnished === false ||
      furnished === "undefined" ||
      furnished === undefined
    ) {
      furnished = { $in: [true, false] };
    }
    let parking = req.query.furnished || false;
    if (
      parking === "false" ||
      parking === false ||
      parking === "undefined" ||
      parking === undefined
    ) {
      parking = { $in: [true, false] };
    }
    let offer = req.query.offer || false;
    if (
      offer === "false" ||
      offer === false ||
      offer === "undefined" ||
      offer === undefined
    ) {
      offer = { $in: [true, false] };
    }
    let limit = req.query.limit || 9;
    let sort = req.query.sort || "createdAt";
    let order = req.query.order || "desc";
    let startIndex = req.query.startIndex || 0;
    const listingDocs = await listingModel
      .find({
        title: { $regex: searchText, $options: "i" },
        type,
        furnished,
        parking,
        offer,
      })
      .limit(limit)
      .sort({ [sort]: order })
      .skip(startIndex);
    res.status(200).json(listingDocs);
  } catch (error) {
    next(error);
  }
};
export const getLikedPlaces = async (req, res, next) => {
  try {
    const { access_token } = req.cookies;
    jwt.verify(access_token, process.env.JWT_SECRET, async (err, userData) => {
      if (err) return next(errorHandler(400, "Token is Not Valid!"));
      const userDoc = await userModel.findById(userData.id);
      const listingDocs = await listingModel
        .find({
          _id: { $in: userDoc.favourite },
        })
        .sort({ createdAt: "desc" });
      res.status(200).json(listingDocs);
    });
  } catch (error) {
    next(error);
  }
};

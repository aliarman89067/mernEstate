import express from "express";
import {
  createListing,
  getListing,
  listById,
  updateListing,
  deleteListing,
  listingInfo,
  searchListing,
  getLikedPlaces,
} from "../controllers/listing.handle.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createListing);
router.get("/get", verifyUser, getListing);
router.get("/list-by-id/:id", verifyUser, listById);
router.put("/update-listing", verifyUser, updateListing);
router.delete("/delete/:id", verifyUser, deleteListing);
router.get("/listing-info/:id", listingInfo);
router.get("/get/search", searchListing);
router.get("/liked/places", verifyUser, getLikedPlaces);

export default router;

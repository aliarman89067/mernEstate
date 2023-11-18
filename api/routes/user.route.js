import express from "express";
import {
  signUp,
  logIn,
  verifyToken,
  googleAuth,
  updateUser,
  signOut,
  deleteUser,
  getUser,
  likePlace,
  getLikedId,
  deleteFavourite,
} from "../controllers/user.auth.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/token", verifyToken);
router.post("/google", googleAuth);
router.put("/update", updateUser);
router.get("/signout", signOut);
router.delete("/delete/:id", deleteUser);
router.get("/get-user/:id", getUser);
router.post("/like-place", likePlace);
router.get("/get/liked/id", verifyUser, getLikedId);
router.post("/delete/favourite", verifyUser, deleteFavourite);

export default router;

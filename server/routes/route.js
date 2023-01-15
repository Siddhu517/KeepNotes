import express from "express";
import { requireSignin } from "../Middleware/index";

import {
  login,
  register,
  VerifyEmailAndSendOTP,
  VerifyOTP,
  ResetPassword,
  addNotes,
  getNotes,
  updateNote,
  deleteNote,
  deleteUser,
} from "../controllers/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password/send-otp", VerifyEmailAndSendOTP);
router.post("/reset-password/verify-otp", VerifyOTP);
router.put("/reset-password", ResetPassword);

/* todos  */
router.post("/add-note", requireSignin, addNotes);
router.get("/get-notes", requireSignin, getNotes);
router.put("/update-note", requireSignin, updateNote);
router.put("/delete-note", requireSignin, deleteNote);

/* account delete */
router.delete("/delete-user", requireSignin, deleteUser);

export default router;

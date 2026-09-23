import { Router } from "express";

import {
  LoginUser,
  accessRefreshToken,
  RegisterUser,
  LogOutUser,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
} from "../controllers/user.controllers.js";

import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/Register").post(
  upload.fields([
    { name: "avatar", maxcount: 1 },
    {
      name: "coverImage",
      maxcount: 1,
    },
  ]),
  RegisterUser,
);

router.route("/login").post(LoginUser);
router.route("/accessRefreshToken").post(accessRefreshToken);

router.route("/LogOutUser").post(LogOutUser);
router.route("/getCurrentUser").get(getCurrentUser);
router.route("/changeCurrentPassword").patch(changeCurrentPassword);
router.route("/updateAccountDetails").patch(updateAccountDetails);

export default router;

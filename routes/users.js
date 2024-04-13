// 外部モジュール
import { Router } from "express";

// 内部モジュール
import User from "../models/Users.js";

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  try {
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});
export default userRouter;

import { Router } from "express";
import User from "../models/Users.js";
const authRouter = Router();
authRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("not found user");
    } else if (req.body.password !== user.password) {
      return res.status(400).send("passwordが間違っています。");
    }
    return res.status(200).json(user);
  } catch (err) {
    console.log(`error:${err}`);
    return res.status(500).json(err);
  }
});

export default authRouter;

import { Router } from "express";
const authRouter = Router();
authRouter.get("/", (req, res) => {
  res.send("auth router");
});

export default authRouter;

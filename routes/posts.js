import { Router } from "express";

const postsRouter = Router();
postsRouter.get("/", (req, res) => {
  res.send("posts router");
});

export default postsRouter;

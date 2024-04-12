import express from "express";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import postsRouter from "./routes/posts.js";
const app = express();

const PORT = 3000;
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => console.log("server start"));

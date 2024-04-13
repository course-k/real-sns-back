// 外部モジュール
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// 内部モジュール
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import postsRouter from "./routes/posts.js";

// 環境変数読み込み
dotenv.config();

// 定数宣言
const PORT = 3000;

// expressインスタンス生成
const app = express();

// MongoDB接続
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_DB_NAME}.g5z6e0w.mongodb.net/`
  )
  .then(() => console.log("db connect success"))
  .catch((err) => console.log(err));

// ルーティング
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => console.log("server start"));

// 外部モジュール
import { Router } from "express";

// 内部モジュール
import User from "../models/Users.js";

const userRouter = Router();

// ユーザー登録
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

// ユーザー更新
userRouter.put("/:id", async (req, res) => {
  try {
    if (req.params.id === req.body.id || req.body.isAuthenticated) {
      const updUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).json(updUser);
    } else {
      return res.status(403).send("更新できません");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// ユーザー削除
userRouter.delete("/:id", async (req, res) => {
  try {
    if (req.params.id === req.body.id || req.body.isAuthenticated) {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json(deletedUser);
    } else {
      return res.status(403).send("削除できません");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ユーザー情報取得
userRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("user not found");
    }
    const { password, updatedAt, ...result } = user._doc;
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// フォロー
userRouter.put("/:targetId/follow", async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.targetId);
    const currentUser = await User.findById(req.body.id);
    // フォロー対象、または自分自身が存在しない
    if (!targetUser || !currentUser) {
      return res.status(404).send("user not found");
    }
    // 自分をフォローしようとしている
    if (req.params.targetId === req.body.id) {
      return res.status(403).send("cannot following yourself");
    }
    // すでにフォロー済
    if (currentUser.followings.includes(req.params.targetId)) {
      return res.status(403).send("already following");
    }
    // ターゲットのフォロワーに自身を追加
    await targetUser.updateOne({ $push: { followers: req.body.id } });
    // 自身のフォローにターゲットを追加
    await currentUser.updateOne({ $push: { followings: req.params.targetId } });
    res.status(200).send("success following");
  } catch (err) {
    res.status(500).json(err);
  }
});

// アンフォロー
userRouter.put("/:targetId/unfollow", async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.targetId);
    const currentUser = await User.findById(req.body.id);
    if (!targetUser || !currentUser) {
      return res.status(404).send("user not found");
    }
    if (!currentUser.followings.includes(req.params.targetId)) {
      return res.status(403).send("not follow");
    }
    await targetUser.updateOne({ $pull: { followers: req.body.id } });
    await currentUser.updateOne({ $pull: { followings: req.params.targetId } });
    return res.status(200).send("success unfollow");
  } catch (err) {
    return res.status(500).json(err);
  }
});
export default userRouter;

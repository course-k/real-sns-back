import { Router } from "express";
import Post from "../models/Posts.js";
import User from "../models/Users.js";

const postsRouter = Router();

// 登録
postsRouter.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 更新
postsRouter.put("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).send("this post has been deleted");
    }
    if (post.userId !== req.body.userId) {
      return res.status(403).send("you can't edit other post");
    }
    const updatedPost = await post.updateOne(req.body);
    return res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 削除
postsRouter.delete("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).send("this post has been deleted");
    }
    if (post.userId !== req.body.userId) {
      return res.status(403).send("you can't delete other post");
    }
    const deletedPost = await post.deleteOne();
    return res.status(200).json(deletedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 取得
postsRouter.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).send("this post has been deleted");
    }
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// いいね付与
postsRouter.put("/:postId/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).send("this post has been deleted");
    }
    if (post.likes.includes(req.body.userId)) {
      const removedLikes = await post.updateOne({
        $pull: { likes: req.body.userId },
      });
      return res.status(200).json(removedLikes);
    } else {
      const addedLikes = await post.updateOne({
        $push: { likes: req.body.userId },
      });
      return res.status(200).json(addedLikes);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

postsRouter.get("/timeline/all", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const myPosts = await Post.find({ userId: user._id });
    const friendPosts = await Promise.all(
      user.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    return res.status(200).json(myPosts.concat(...friendPosts));
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default postsRouter;

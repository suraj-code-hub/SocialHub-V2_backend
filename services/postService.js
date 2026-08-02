import Post from "../models/Post.js";

export const createPostService = async (data) => {
  return await Post.create(data);
};

export const getPostsService = async (query) => {
  return await Post.find(query).sort({
    createdAt: -1,
  });
};

export const getPostByIdService = async (id) => {
  return await Post.findById(id);
};

export const updatePostService = async (id, data) => {
  return await Post.findByIdAndUpdate(id, data, {
    // new: true,
     returnDocument: "after",
    runValidators: true,
  });
};

export const deletePostService = async (id) => {
  return await Post.findByIdAndDelete(id);
};
import apiClient from "./api-service";
import { Post } from "./interfaces";

export const getAllPosts = (): Promise<Post[]> => {
  return apiClient.get("posts/");
};

export const getPostById = (postId: string): Promise<Post> => {
  return apiClient.get(`posts/${postId}`);
};

export const createPost = (postData: Post) => {
  return apiClient.post("posts/", postData);
};

export const updatePost = (postId: string, postData: Post) => {
  return apiClient.put(`posts/${postId}`, postData);
};

export const deletePost = (postId: string) => {
  return apiClient.delete(`posts/${postId}`);
};

export default { getAllPosts, createPost, updatePost, deletePost, getPostById };

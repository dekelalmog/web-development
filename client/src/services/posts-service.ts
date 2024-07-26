import apiClient from "./api-service";
import { Post } from "./interfaces";

export const getAllPosts = (): Promise<Post[]> => {
  return apiClient.get("/");
};

export const getPostById = (postId: string): Promise<Post> => {
  return apiClient.get(`/${postId}`);
};

export const createPost = (postData: Post) => {
  return apiClient.post("/", postData);
};

export const updatePost = (postId: string, postData: Post) => {
  return apiClient.put(`/${postId}`, postData);
};

export const deletePost = (postId: string) => {
  return apiClient.delete(`/${postId}`);
};

export default { getAllPosts, createPost, updatePost, deletePost, getPostById };

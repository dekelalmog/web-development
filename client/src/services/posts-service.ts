import apiClient from "./api-service";
import { Post, Comment } from "./interfaces";

export const getAllPosts = (): Promise<Post[]> => {
  return apiClient.get("posts/").then((res) => res.data);
};

export const getPostById = (postId: string): Promise<Post> => {
  return apiClient.get(`posts/${postId}`).then((res) => res.data);
};

export const createPost = (postData: Post) => {
  return apiClient.post("posts/", postData);
};

export const updatePost = (postId: string, postData: Post) => {
  return apiClient.put(`posts/${postId}`, postData);
};

export const addComment = (postId: string, comment: Comment) => {
  return apiClient.put(`posts/comment/${postId}`, comment);
}

export const deletePost = (postId: string) => {
  return apiClient.delete(`posts/${postId}`);
};

export default { getAllPosts, createPost, updatePost, deletePost, getPostById, addComment };

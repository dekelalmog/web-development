import apiClient from "./api-service";
import { Post, Comment } from "./interfaces";

export const getAllPosts = (): Promise<Post[]> => {
  return apiClient.get("posts/").then((res) => res.data);
};

export const getPostById = (postId: string): Promise<Post> => {
  return apiClient.get(`posts/${postId}`).then((res) => res.data);
};

export const createPost = (postData: Post): Promise<Post> => {
  return apiClient.post("posts/", postData).then((res) => res.data);
};

export const updatePost = (postData: Post) => {
  return apiClient.put(`posts/${postData._id}`, postData);
};

export const addComment = (postId: string, comment: Comment) => {
  return apiClient.put(`posts/comment/${postId}`, comment);
}

export const deletePost = (postId: string) => {
  return apiClient.delete(`posts/${postId}`);
};

export default { getAllPosts, createPost, updatePost, deletePost, getPostById, addComment };

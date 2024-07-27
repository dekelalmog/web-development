import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Comment, Post, User } from "../../services/interfaces";
import { addComment, getPostById } from "../../services/posts-service";
import { getUserById } from "../../services/user-service";
import Toolbar from "../Toolbar/Toolbar";
import "./PostPage.css";

const PostPage: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<JSX.Element[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    getPostById(id)
      .then((data) => {
        setPost(data);
      })
      .catch((error) => {
        setError("Error occurred, please try again later");
        setLoading(false);
        console.error("Error fetching post:", error);
      });
  }, [id]);

  useEffect(() => {
    if (!post || !post.comments.length) return;

    const fetchUsers = async () => {
      try {
        const userPromises = post.comments.map((comment) => getUserById(comment.owner));
        const fetchedUsers = await Promise.all(userPromises);
        const usersMap = fetchedUsers.reduce((acc, user) => {
          acc[user._id] = user;
          return acc;
        }, {} as { [key: string]: User });
        setUsers(usersMap);
      } catch (error) {
        setError("Error occurred, please try again later");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [post]);

  useEffect(() => {
    if (post && Object.keys(users).length) {
      buildComments(post.comments);
    }
  }, [post, users]);

  const buildComments = (comments: Comment[]) => {
    if (!comments) return;

    const builtComments = comments.map((comment, index) => {
      const user = users[comment.owner];
      return (
        <div className="comment-container" key={index}>
          <div className="header">
            <span className="name">{user?.name}</span>
            <img className="img" src={user?.imageUrl} alt="User" />
          </div>
          <p className="content">{comment.text}</p>
        </div>
      );
    });
    setComments(builtComments);
  };

  const submitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!post || !comment) return;

    const newComment: Comment = {
      owner: post.ownerId,
      text: comment,
    };

    try {
      await addComment(post._id!, newComment);
      setPost({
        ...post,
        comments: [...post.comments, newComment],
      });
      setComment("");
    } catch (error) {
      setError("Error occurred, please try again later");
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div>
      <Toolbar />
      {!loading && post ? (
        <div className="post-container">
          <p className="content">{post.description}</p>
          {post.imageUrl && <img className="post-img" src={post.imageUrl} alt="Post" />}
          <h2>Comments</h2>
          {comments}
          <form className="form" onSubmit={submitComment}>
            <input
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <button type="submit">Add Comment</button>
          </form>
        </div>
      ) : (
        <>loading...</>
      )}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default PostPage;
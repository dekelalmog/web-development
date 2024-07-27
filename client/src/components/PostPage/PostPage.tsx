import React from "react";
import { useParams } from "react-router-dom";
import { Comment, Post, User } from "../../services/interfaces";
import { addComment, getPostById } from "../../services/posts-service";
import { getUserById } from "../../services/user-service";
import Toolbar from "../Toolbar/Toolbar";
import "./PostPage.css";

const PostPage: React.FC = () => {
  const [post, setPost] = React.useState<Post>();
  const [users, setUsers] = React.useState<User[]>([]);
  const [comment, setComment] = React.useState<string>("");
  const [comments, setComments] = React.useState<JSX.Element[]>([]);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const { id } = useParams();

  React.useEffect(() => {
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

  React.useEffect(() => {
    try {
      post?.comments.forEach(async (comment, index) => {
        const user = await getUserById(comment.owner);
        setUsers([...users, user]);
        if (index === post.comments.length - 1) {
          buildComments(post.comments);
        }
      });
    } catch (error) {
      setError("Error occurred, please try again later");
    } finally {
      setLoading(false);
    }
  }, [post?._id]);

  const buildComments = (comments: Comment[]) => {
    if (!comments) return;

    const builtComments = comments.map((comment, index) => {
      const user = users.find((user) => user._id === comment.owner);
      return (
        <div className="comment-container" key={index}>
          <div className="header">
            <span className="name">{user?.name}</span>
            <img className="img" src={user?.imageUrl} alt="User Image" />
          </div>
          <p className="content">{comment.text}</p>
        </div>
      );
    });
    setComments([...builtComments]);
  };

  const submitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!post || !comment) return;

    const newComment: Comment = {
      owner: post.ownerName,
      text: comment,
    };

    try {
      await addComment(post._id, newComment);
      setPost({
        ...post,
        comments: [...post.comments, newComment],
      });

      setComment("");
    } catch (error) {
      setError("Error occurred, please try again later");
      console.log("Error adding comment:", error);
    }
  };

  return (
    <div>
      <Toolbar />
      {!loading && post ? (
        <div className="post-container">
          <p className="content">{post.description}</p>
          {post.imageUrl && <img className="post-img" src={post.imageUrl} alt="Post Image" />}
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

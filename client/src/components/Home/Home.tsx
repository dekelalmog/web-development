import React, { useEffect, useMemo, useState } from "react";
import {
  createPost,
  getAllPosts,
  updatePost,
} from "../../services/posts-service";
import { Post } from "../../services/interfaces";
import "./Home.css";
import Toolbar from "../Toolbar/Toolbar";
import { Link } from "react-router-dom";
import CreatePost from "../CreatePost/CreatePost";
import UpdatePost from "../UpdatePost/UpdatePost";
import { getUserById } from "../../services/user-service";

const Home: React.FC = () => {
  const userId = localStorage.getItem("userId");
  const [posts, setPosts] = useState<Post[]>();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post>();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        console.log(data);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const postsToShow = useMemo(() => {
    if (!posts) return [];

    return showAllPosts
      ? posts
      : posts.filter((post) => post.ownerId === userId);
  }, [posts, showAllPosts]);

  const handlePostClick = (post: Post) => {
    if (post.ownerId === userId) {
      setSelectedPost(post);
      setShowEditPost(true);
    }
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const addPost = async (description: string, imageUrl?: string) => {
    getUserById(userId!)
      .then((user) => {
        const newPost: Post = {
          description,
          imageUrl,
          ownerId: userId!,
          ownerName: user.name,
          comments: [],
          ownerImageUrl: user.imageUrl,
        };
        createPost(newPost);
        console.log("Creating post:", newPost);
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };

  const editPost = async (description: string, imageUrl?: string) => {
    if (!selectedPost) return;

    const updatedPost: Post = {
      ...selectedPost,
      description,
      imageUrl,
    };

    try {
      await updatePost(updatedPost);
      console.log("Updating post:", updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      console.log("Deleting post with id:", postId);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <>
      <Toolbar />
      {showCreatePost && (
        <CreatePost
          showModal={showCreatePost}
          setShowModal={setShowCreatePost}
          createPost={addPost}
        />
      )}
      {showEditPost && (
        <UpdatePost
          showModal={showEditPost}
          setShowModal={setShowEditPost}
          updatePost={editPost}
          deletePost={deletePost}
          post={selectedPost!}
        />
      )}
      <button onClick={handleCreatePost}>Create Post</button>
      <div className="posts-container">
        <button
          className="toogle-btn"
          onClick={() => setShowAllPosts(!showAllPosts)}
        >
          {showAllPosts ? "Show my posts" : "Show all posts"}
          {showAllPosts && <i className="fa fa-filter" aria-hidden="true"></i>}
        </button>
        {posts?.length &&
          postsToShow.map((post: Post) => (
            <div
              key={post._id}
              className="post-card"
              onClick={() => handlePostClick(post)}
            >
              <h6>{post.ownerName}</h6>
              <p>{post.description}</p>
              {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
              <div>
                <Link to={`post/${post._id}`} target="_blank">
                  comments ({post.comments.length})
                </Link>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Home;

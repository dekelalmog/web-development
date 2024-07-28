import React, { useEffect, useMemo, useState } from "react";
import {
  createPost,
  deletePost,
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
  const [posts, setPosts] = useState<Post[]>([]);
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
        createPost(newPost).then((post) => {
          setPosts([post, ...posts]);
          console.log("Creating post:", newPost);
        });
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
      imageUrl: imageUrl || selectedPost.imageUrl,
    };

    try {
      await updatePost(updatedPost);
      setPosts(
        posts?.map((post) => {
          if (post._id == updatedPost._id) {
            return updatedPost;
          } else {
            return post;
          }
        })
      );
      console.log("Updating post:", updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const deleteSelectedPost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts?.filter((post) => post._id != postId));
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
          deletePost={deleteSelectedPost}
          post={selectedPost!}
        />
      )}
      <div className="posts-container">
        <div className="actions">
          <button
            className="toogle-btn"
            title={showAllPosts ? "Filter" : "Remove filter"}
            onClick={() => setShowAllPosts(!showAllPosts)}
          >
            {showAllPosts ? "Show my posts" : "Show all posts"}
            {showAllPosts && (
              <i className="fa fa-filter" aria-hidden="true"></i>
            )}
          </button>
          <button className="create-btn" title="create post" onClick={handleCreatePost}>
            <i className="fa fa-plus"></i>
          </button>
        </div>
        {posts?.length &&
          postsToShow.map((post: Post) => (
            <div
              key={post._id}
              className="post-card"
              onClick={() => handlePostClick(post)}
            >
              <div className="header">
                <span className="name">{post.ownerName}</span>
                <img className="img" src={post.ownerImageUrl} alt="User" />
              </div>
              <p>{post.description}</p>
              {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
              <div>
                <Link to={`post/${post._id}`}>
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

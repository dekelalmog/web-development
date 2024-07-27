import React, { useEffect, useMemo, useState } from "react";
import { getAllPosts } from "../../services/posts-service";
import { Post } from "../../services/interfaces";
import "./Home.css";
import Toolbar from "../Toolbar/Toolbar";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>();
  const [showAllPosts, setShowAllPosts] = useState(true);

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
      : posts.filter((post) => post.ownerName === "Your Name");
  }, [posts, showAllPosts]);

  const handlePostClick = (post: Post) => {
    const currentUserId = localStorage.getItem("userId");
    if (post.ownerId === currentUserId) {
      // Open modal to edit user
      // Your code here...
    }
  };

  return (
    <>
      <Toolbar />
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

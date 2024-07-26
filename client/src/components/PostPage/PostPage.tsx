import React from "react";
import { Comment, Post } from "../../services/interfaces";

interface PostPageProps {
  // Define the props for the PostPage component here
}

const PostPage: React.FC<PostPageProps> = () => {
  const [post, setPost] = React.useState<Post>();

  React.useEffect(() => {
    // Fetch the post data from the API
    // Use the post ID from the URL to fetch the correct post
    // Update the state with the post data
  }, []);

  return (
    <div>
      {post && (
        <>
          <p>{post.description}</p>
          <img src={post.imageUrl} alt="Post Image" />
          <h2>Comments</h2>
            {post.comments.map((comment: Comment, index: number) => (
                <div>
                    <span key={index}>{comment.owner}</span>
                    <p>{comment.text}</p>
                </div>
            ))}
          <form>
            <input type="text" placeholder="Add a comment" />
            <button type="submit">Add Comment</button>
          </form>
        </>
      )}
    </div>
  );
};

export default PostPage;

import React, { useEffect, useState } from 'react';
import UploadPost from '../UploadPost/UploadPost';

const Home: React.FC = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://api.example.com/posts');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            <h1>Home</h1>
            <UploadPost></UploadPost>
            {posts.map((post: any) => (
                <div key={post.owner}>
                    <h2>{post.description}</h2>
                    <p>{post.body}</p>
                </div>
            ))}
        </div>
    );
};

export default Home;
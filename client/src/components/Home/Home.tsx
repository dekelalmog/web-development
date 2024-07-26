import React, { useEffect, useState } from 'react';
import UploadPost from '../UploadPost/UploadPost';
import { getAllPosts } from '../../services/posts-service';
import { Post } from '../../services/interfaces';

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getAllPosts();
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
            {posts?.length && posts.map((post: any) => (
                <div key={post.owner}>
                    <h2>{post.description}</h2>
                    <p>{post.body}</p>
                </div>
            ))}
        </div>
    );
};

export default Home;
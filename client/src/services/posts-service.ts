import ApiService from './api-service';

class PostsService {
    private apiService: ApiService;

    constructor() {
        const baseUrl = '/';
        this.apiService = new ApiService(baseUrl);
    }

    getAllPosts() {
        return this.apiService.get('/posts');
    }

    createPost(postData: any) {
        return this.apiService.post('/posts', postData);
    }

    updatePost(postId: string, postData: any) {
        return this.apiService.put(`/posts/${postId}`, postData);
    }

    deletePost(postId: string) {
        return this.apiService.delete(`/posts/${postId}`);
    }
}

export default PostsService;
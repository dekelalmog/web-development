import ApiService from './api-service';
import { Post } from './interfaces';

class PostsService {
    private apiService: ApiService;

    constructor() {
        const baseUrl = '/posts';
        this.apiService = new ApiService(baseUrl);
    }

    getAllPosts(): Promise<Post[]> {
        return this.apiService.get('/');
    }

    createPost(postData: Post) {
        return this.apiService.post('/', postData);
    }

    updatePost(postId: string, postData: Post) {
        return this.apiService.put(`/${postId}`, postData);
    }

    deletePost(postId: string) {
        return this.apiService.delete(`/${postId}`);
    }
}

export default PostsService;
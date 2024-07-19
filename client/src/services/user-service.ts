import ApiService from './api-service';

class UserService {
    private apiService: ApiService;

    constructor() {
        const baseUrl = '/users';
        this.apiService = new ApiService(baseUrl);
    }

    register(username: string, password: string) {
        // Implement the registration logic here
        // Use this.apiService to make API requests
        // Return a Promise that resolves when the registration is successful

    }

    login(username: string, password: string) {
        // Implement the login logic here
        // Use this.apiService to make API requests
        // Return a Promise that resolves when the login is successful
    }

    logout() {
        // Implement the logout logic here
        // Use this.apiService to make API requests
        // Return a Promise that resolves when the logout is successful
    }

    refreshToken() {
        // Implement the refresh token logic here
        // Use this.apiService to make API requests
        // Return a Promise that resolves when the token is refreshed
    }

    getUserById(userId: string) {
        // Implement the logic to get a user by ID here
        // Use this.apiService to make API requests
        // Return a Promise that resolves with the user data
    }
}

export default UserService;
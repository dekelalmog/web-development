import { CredentialResponse } from "@react-oauth/google";
import ApiService from "./api-service";
import { User } from "./interfaces";

class UserService {
  private apiService: ApiService;

  constructor() {
    const baseUrl = "http://localhost:3000/users";
    this.apiService = new ApiService(baseUrl);
  }

  register = (
    email: string,
    password: string,
    imgageUrl: string,
    name: string
  ) => {
    console.log("register ...", email, password, imgageUrl, name);

    return new Promise<User>((resolve, reject) => {
      this.apiService
        .post("register", { email, password, imgageUrl, name })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  login = (email: string, password: string) => {
    console.log("login ...", email, password);
    return new Promise<User>((resolve, reject) => {
      this.apiService
        .post("login", { email, password })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  logout = () => {
    console.log("logout ...");

    return new Promise<void>((resolve, reject) => {
      this.apiService
        .post("logout", {})
        .then((response: any) => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  refreshToken = () => {
    console.log("refreshToken ...");

    return new Promise<User>((resolve, reject) => {
      this.apiService
        .post("refresh-token", {})
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getUserById = (userId: string) => {
    console.log("getUserById ...", userId);

    return new Promise<User>((resolve, reject) => {
      this.apiService
        .get(userId)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  googleSignin = (credentialResponse: CredentialResponse) => {
    return new Promise<User>((resolve, reject) => {
      console.log("googleSignin ...");
      this.apiService
        .post("google-login", credentialResponse)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}

export default UserService;

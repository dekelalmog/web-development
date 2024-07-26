import { CredentialResponse } from "@react-oauth/google";
import ApiService from "./api-service";

export interface IUser {
  email: string;
  password?: string;
  imgUrl?: string;
  _id?: string;
  accessToken?: string;
  refreshToken?: string;
}

class UserService {
  private apiService: ApiService;

  constructor() {
    const baseUrl = "http://localhost:3000/users";
    this.apiService = new ApiService(baseUrl);
  }

  register(email: string, password: string, imgageUrl: string, name: string) {
    console.log("register ...", email, password, imgageUrl, name);

    return new Promise<IUser>((resolve, reject) => {
      new ApiService("http://localhost:3000/users")
        .post("register", { email, password, imgageUrl, name })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  login(email: string, password: string) {
    console.log("login ...", email, password);
    return new Promise<IUser>((resolve, reject) => {
      new ApiService("http://localhost:3000/users")
        .post("login", { email, password })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  logout() {
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
  }

  refreshToken() {
    console.log("refreshToken ...");

    return new Promise<IUser>((resolve, reject) => {
      this.apiService
        .post("refresh-token", {})
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getUserById(userId: string) {
    console.log("getUserById ...", userId);

    return new Promise<IUser>((resolve, reject) => {
      this.apiService
        .get(userId)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  googleSignin = (credentialResponse: CredentialResponse) => {
    return new Promise<IUser>((resolve, reject) => {
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

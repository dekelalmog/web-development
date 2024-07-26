import { CredentialResponse } from "@react-oauth/google";
import apiClient from "./api-service";
import { User } from "./interfaces";

export const register = (
  email: string,
  password: string,
  imgageUrl: string,
  name: string
) => {
  console.log("register ...", email, password, imgageUrl, name);

  return new Promise<User>((resolve, reject) => {
    apiClient
      .post("register", { email, password, imgageUrl, name })
      .then((response: any) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const login = (email: string, password: string) => {
  console.log("login ...", email, password);
  return new Promise<User>((resolve, reject) => {
    apiClient
      .post("login", { email, password })
      .then((response: any) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const logout = () => {
  console.log("logout ...");

  return new Promise<void>((resolve, reject) => {
    apiClient
      .post("logout", {})
      .then((response: any) => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const refreshToken = () => {
  console.log("refreshToken ...");

  return new Promise<User>((resolve, reject) => {
    apiClient
      .post("refresh-token", {})
      .then((response: any) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getUserById = (userId: string) => {
  console.log("getUserById ...", userId);

  return new Promise<User>((resolve, reject) => {
    apiClient
      .get(userId)
      .then((response: any) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const googleSignin = (credentialResponse: CredentialResponse) => {
  return new Promise<User>((resolve, reject) => {
    console.log("googleSignin ...");
    apiClient
      .post("google-login", credentialResponse)
      .then((response: any) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default {
  register,
  login,
  logout,
  refreshToken,
  getUserById,
  googleSignin,
};

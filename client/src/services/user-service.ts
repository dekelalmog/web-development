import { CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import apiClient from "./api-service";
import { User } from "./interfaces";

export const register = async (
  email: string,
  password: string,
  name: string,
  imageUrl: string
) => {
  console.log("register ...", email, password, name, imageUrl);

  try {
    const response = await apiClient.post("users/register", {
      email,
      password,
      imageUrl,
      name,
    });

    localStorage.setItem("accessToken", response.data.tokens[0]);
    localStorage.setItem("userId", response.data._id);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  console.log("login ...", email, password);
  try {
    const response = await apiClient.post("users/login", { email, password });
    localStorage.setItem("accessToken", response.data.tokens.accessToken);
    localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
    localStorage.setItem("userId", response.data._id);
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  console.log("logout ...");
  const SERVER_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  try {
    const client = axios.create({
      baseURL: SERVER_URL,
    });
    await client.post("users/logout", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
      },
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  } catch (error) {
    throw error;
  }
};

export const updateUser = (_id: string, name: string, imageUrl?: string) => {
  return new Promise<User>((resolve, reject) => {
    apiClient
      .put("users/", { _id, imageUrl, name })
      .then((response: any) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const refreshToken = () => {
  console.log("users/refreshToken ...");

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
  return new Promise<User>((resolve, reject) => {
    apiClient
      .get(`users/${userId}`)
      .then((response: any) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const googleSignin = async (credentialResponse: CredentialResponse) => {
  console.log("googleSignin ...");
  try {
    const response = await apiClient.post(
      "users/google-login",
      credentialResponse
    );

    localStorage.setItem("accessToken", response.data.tokens.accessToken);
    localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
    localStorage.setItem("userId", response.data._id);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  register,
  login,
  logout,
  refreshToken,
  getUserById,
  googleSignin,
};

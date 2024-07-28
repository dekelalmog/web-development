import DefaultImg from "../assets/default-avatar.jpg";

const SERVER_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const imageFullPath = (imageURL: string): string => {
  return SERVER_URL + imageURL;
};

export const imageSrc = (imageURL?: string): string => {
  return imageURL ? SERVER_URL + imageURL : DefaultImg;
};

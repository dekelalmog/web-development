export interface Post {
  _id?: string;
  description: string;
  imageUrl?: string;
  owner: string;
  comments: Comment[];
}

export interface Comment {
  owner: string;
  text: string;
}

export interface User {
  _id: number;
  name: string;
  email: string;
  password?: string;
  tokens: string[];
  imageUrl?: string;
  accessToken?: string;
  refreshToken?: string;
}

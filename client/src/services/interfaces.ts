export interface Post {
  _id?: string;
  description: string;
  imageUrl?: string;
  ownerName: string;
  ownerId: string;
  ownerImageUrl?: string;
  comments: Comment[];
}

export interface Comment {
  owner: string;
  text: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  tokens: string[];
  imageUrl?: string;
  accessToken?: string;
  refreshToken?: string;
}

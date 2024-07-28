const SERVER_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"

export const imageFullPath = (imageURL: string): string => {
    return SERVER_URL + imageURL;
}
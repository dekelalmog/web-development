import apiClient from "./api-service";

export const uploadFile = async (image: File): Promise<string> => {

    const formData = new FormData();

    formData.append('file', image);

    return (await apiClient.post("file/", formData)).data.url;
};
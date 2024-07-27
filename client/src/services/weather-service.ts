import apiClient from "./api-service";

export interface Weather {
    time: string[];
    temperature: { [key: string]: number };
}

export const getWeather = async (): Promise<Weather> => {
  return apiClient.get(`weather/today/`).then((res) => res.data);
};

export default { getWeather };
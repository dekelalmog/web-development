import getWeather from "../service/weatherApi";
import { Request, Response } from 'express';

export async function getTodaysWeather(req: Request, res: Response) {
    try {
        const weather = await getWeather()

        res.status(200).json(weather)
    } catch (err) {
        res.status(500).send("Internal Server Error")
    }
}
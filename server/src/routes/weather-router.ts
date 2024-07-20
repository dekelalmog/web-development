import express from 'express';
import { getTodaysWeather } from '../controllers/weather-controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Weather
 *  description: Weather API
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   Weather:
 *    type: object
 *    properties:
 *      time:
 *        type: string
 *        description: Hour of the day
 *      temperature:
 *        type: number
 *        description: Temperature at the given hour
 *    example:
 *      time: '14:00'
 *      temperature: 24.5
 */

/**
 * @swagger
 * /weather/today:
 *   get:
 *     summary: Get today's weather
 *     tags: [Weather]
 *     responses:
 *       200:
 *         description: A list of weather data for every hour of today
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Weather'
 *       500:
 *         description: Internal server error
 */
router.get('/today', getTodaysWeather);

export default router;

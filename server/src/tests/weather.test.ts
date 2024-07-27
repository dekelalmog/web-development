import path from 'path'; 
import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import { Weather } from '../models/weather';

let app: Express;

beforeAll(async () => {
  app = await initApp();
})

afterAll(async () => {
  await mongoose.connection.close();
  
})

describe("Weather API test" , () => {
  test("get a 24 list of temperature and hours" , async () => {
    try {
      const response = await request(app).get("/weather/today")
      const weatherForecast: Weather = response.body
      expect(response.status).toBe(200);
      expect(weatherForecast.time.length).toEqual(24);
      expect(Object.keys(weatherForecast.temperature).length).toEqual(24);
    } catch (err) {
      expect(1).toEqual(2);
    }
  })
})
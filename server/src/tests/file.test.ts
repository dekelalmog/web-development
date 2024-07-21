 import path from 'path'; 
import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import fs from 'fs';

let app: Express;

beforeAll(async () => {
  app = await initApp();
})

afterAll(async () => {
  await mongoose.connection.close();
})

describe("File Tests" , () => {
  test("upload file" , async () => {
    const filePath = `${__dirname }/avatar.png`;
    try {
      const response = await request(app).post("/file" ).attach('file', filePath)
      expect(response.statusCode).toEqual(200);

      const { url } = response.body;
      const fileUrl = url.replace(/^.*\/\/[^/]+/, '');
      const uploadedFilePath = path.join(__dirname, '../..', 'images', path.basename(fileUrl));
      
      expect(fs.existsSync(uploadedFilePath)).toBe(true)

      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      } else {
        expect(2).toEqual(1);
      }
    } catch (err) {
      console.log(err);
      expect(1).toEqual(2);
    }
  })
})
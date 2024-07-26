import request from 'supertest';
import mongoose from 'mongoose';
import initApp from '../app';
import { Express } from 'express';
import UserModel from '../models/user';
import bcrypt from "bcrypt";
import { generateTokens } from '../controllers/user-controller';

let app: Express;

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Routes', () => {
  describe('GET /users/:id', () => {
    let userId: string;

    beforeAll(async () => {
      // Create a test user
      const user = await UserModel.create({
        id: 1,
        email: 'testuser@example.com',
        password: 'password123',
        tokens: [],
      });
      userId = user._id.toString();
    });

    afterAll(async () => {
      // Clean up the test user
      await UserModel.findByIdAndDelete(userId);
    });

    test('should get user by ID', async () => {
      const response = await request(app).get(`/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('testuser@example.com');
    });

    test('should return 500 if user not found', async () => {
      const response = await request(app).get('/users/invalidId');
      expect(response.status).toBe(500);
    });
  });

  describe('POST /register', () => {
    test('should register a new user', async () => {
      const newUser = {
        email: 'newuser@example.com',
        password: 'password123',
        imageUrl: 'http://example.com/image.jpg',
        name: 'New User',
      };

      const response = await request(app).post('/users/register').send(newUser);
      expect(response.status).toBe(201);
      expect(response.body.email).toBe(newUser.email);

      // Clean up the created user
      await UserModel.findOneAndDelete({ email: newUser.email });
    });

    test('should return 400 if user already exists', async () => {
      const existingUser = {
        email: 'existinguser@example.com',
        password: 'password123',
        imageUrl: 'http://example.com/image.jpg',
        name: 'Existing User',
      };

      await UserModel.create(existingUser);

      const response = await request(app).post('/users/register').send(existingUser);
      expect(response.status).toBe(400);

      // Clean up the created user
      await UserModel.findOneAndDelete({ email: existingUser.email });
    });
  });

  describe('POST /login', () => {
    let user: any;

    beforeAll(async () => {
      user = await UserModel.create({
        email: 'loginuser@example.com',
        password: await bcrypt.hash('password123', 10),
        tokens: [],
      });
    });

    afterAll(async () => {
      await UserModel.findByIdAndDelete(user._id);
    });

    test('should login user with valid credentials', async () => {
      const credentials = {
        email: 'loginuser@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/users/login').send(credentials);
      expect(response.status).toBe(200);
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');
    });

    test('should return 400 for invalid credentials', async () => {
      const credentials = {
        email: 'loginuser@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app).post('/users/login').send(credentials);
      expect(response.status).toBe(400);
    });
  });

  describe('POST /refresh-token', () => {
    let user: any;
    let refreshToken: string;

    beforeAll(async () => {
      user = await UserModel.create({
        email: 'tokenuser@example.com',
        password: await bcrypt.hash('password123', 10),
        tokens: [],
      });
      const tokens = await generateTokens(user);
      refreshToken = tokens.refreshToken;
    });

    afterAll(async () => {
      await UserModel.findByIdAndDelete(user._id);
    });

    test('should refresh token with valid refresh token', async () => {
      const response = await request(app)
        .post('/users/refresh-token')
        .send({ token: refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');
    });

    test('should return 401 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/users/refresh-token')
        .send({ token: 'invalidToken' });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /logout', () => {
    let user: any;
    let refreshToken: string;

    beforeAll(async () => {
      user = await UserModel.create({
        email: 'logoutuser@example.com',
        password: await bcrypt.hash('password123', 10),
        tokens: [],
      });
      const tokens = await generateTokens(user);
      refreshToken = tokens.refreshToken;
    });

    afterAll(async () => {
      await UserModel.findByIdAndDelete(user._id);
    });

    test('should logout user with valid token', async () => {
      const response = await request(app)
        .post('/users/logout')
        .send({ token: refreshToken });

      expect(response.status).toBe(200);
    });

    test('should return 401 for invalid token', async () => {
      const response = await request(app)
        .post('/users/logout')
        .send({ token: 'invalidToken' });

      expect(response.status).toBe(401);
    });
  });
});

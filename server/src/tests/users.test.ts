import request from 'supertest';
import mongoose from 'mongoose';
import initApp from '../app';
import { Express } from 'express';
import UserModel from '../models/user';
import bcrypt from "bcrypt";
import { generateTokens } from '../controllers/user-controller';
import { OAuth2Client } from 'google-auth-library';

jest.mock('google-auth-library');

const MockOAuth2Client = OAuth2Client as jest.Mocked<typeof OAuth2Client>;

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await UserModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Routes', () => {
  describe('GET /users/:id', () => {
    let userId: string;
    let userEmail = "testuser@example.com"
    
    beforeAll(async () => {
      const user = await UserModel.create({
        email: userEmail,
        password: 'password123',
        tokens: [],
      });
      userId = user._id;
    });

    afterAll(async () => {
      await UserModel.findByIdAndDelete(userId);
    });

    test('should get user by ID', async () => {
      const response = await request(app).get(`/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(userEmail);
    });

    test('should return 404 if user not found', async () => {
      const response = await request(app).get('/users/invalidId');
      expect(response.status).toBe(404);
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
        .set("authorization", `Bearer ${refreshToken}`);

      expect(response.status).toBe(200);
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');
    }, 15000);

    test('should return 401 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/users/refresh-token')
        .set("authorization", `Bearer InvalidToken`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /logout', () => {
    let user: any;
    let refreshToken: string;
    let accessToken: string;

    beforeAll(async () => {
      user = await UserModel.create({
        email: 'logoutuser@example.com',
        password: await bcrypt.hash('password123', 10),
        tokens: [],
      });
      const tokens = await generateTokens(user);
      refreshToken = tokens.refreshToken;
      accessToken = tokens.accessToken;
    });

    afterAll(async () => {
      await UserModel.findByIdAndDelete(user._id);
    });

    test('should logout user with valid token', async () => {
      const response = await request(app)
        .post('/users/logout').set("authorization", `Bearer ${refreshToken}`);

      expect(response.status).toBe(200);
    });

    test('should return 401 for invalid token', async () => {
      const response = await request(app)
        .post('/users/logout')
        .set("authorization", `Bearer InvalidToken`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /google-login', () => {
    test('Google login - existing user', async () => {
      const mockTicket = {
        getPayload: jest.fn().mockReturnValue({
          email: 'existinguser@example.com',
          picture: 'http://example.com/image.jpg',
        }),
      };

      MockOAuth2Client.prototype.verifyIdToken = jest.fn().mockResolvedValue(mockTicket);

      await UserModel.create({
        email: 'existinguser@example.com',
        password: await bcrypt.hash('password123', 10),
        tokens: [],
      });

      const credential = 'mock-google-id-token';

      const response = await request(app)
        .post('/users/google-login')
        .send({ credential });

      expect(response.statusCode).toEqual(200);
      expect(response.body.email).toEqual('existinguser@example.com');
      expect(response.body).toHaveProperty('tokens');
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');

      await UserModel.findOneAndDelete({ email: 'existinguser@example.com' });
    });

    test('Google login - new user', async () => {
      const mockTicket = {
        getPayload: jest.fn().mockReturnValue({
          email: 'newuser@example.com',
          picture: 'http://example.com/image.jpg',
        }),
      };

      MockOAuth2Client.prototype.verifyIdToken = jest.fn().mockResolvedValue(mockTicket);

      const credential = 'mock-google-id-token';

      const response = await request(app)
        .post('/users/google-login')
        .send({ credential });

      expect(response.statusCode).toEqual(200);
      expect(response.body.email).toEqual('newuser@example.com');
      expect(response.body).toHaveProperty('tokens');
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');

      await UserModel.findOneAndDelete({ email: 'newuser@example.com' });
    });

    test('Google login - invalid token', async () => {
      MockOAuth2Client.prototype.verifyIdToken = jest.fn().mockRejectedValue(new Error("Invalid token"));

      const credential = 'invalid-google-id-token';

      const response = await request(app)
        .post('/users/google-login')
        .send({ credential });

      expect(response.statusCode).toEqual(400);
    });
  });

  describe('PUT /users', () => {
    let user: any;
  
    beforeAll(async () => {
      user = await UserModel.create({
        email: 'updateuser@example.com',
        password: await bcrypt.hash('password123', 10),
        tokens: [],
        imageUrl: 'URL1',
        name: 'Old User',
      });
    });
  
    afterAll(async () => {
      await UserModel.findByIdAndDelete(user._id);
    });
  
    test('should update user details', async () => {
      const updatedUser = {
        _id: user._id,
        imageUrl: 'URL2',
        name: 'Updated User',
      };
  
      const response = await request(app).put('/users/').send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body.user.imageUrl).toBe(updatedUser.imageUrl);
      expect(response.body.user.name).toBe(updatedUser.name);
    });
  
    test('should return 500 for internal error', async () => {
      const invalidUser = {
        _id: 'invalidId',
        imageUrl: 'http://example.com/updated-image.jpg',
        name: 'Updated User',
      };
  
      const response = await request(app).put('/users/').send(invalidUser);
      expect(response.status).toBe(500);
    });
  });
});

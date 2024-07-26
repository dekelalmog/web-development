import path from 'path'; 
import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import PostModel from '../models/post';
import { Comment } from '../models/comment';

let app: Express;

// Cant use Post from file, uses Document
type Post = {
  _id?: string;
  description: string;
  imageUrl?: string;
  owner: string;
  comments: Comment[];
}

const testPost: Post = {
  description: "TestDescription",
  owner: "Ben",
  comments: [
    {
      owner: "Dekel",
      text: "Wow Ben! Nice Post"
    }
  ]
}

beforeAll(async () => {
  app = await initApp();
  await PostModel.deleteMany();
})

afterAll(async () => {
  await mongoose.connection.close();
})

describe("Posts Tests" , () => {
  test("Get all posts" , async () => {
    const res = await request(app).get('/posts')
    expect(res.body).toStrictEqual([])
    expect(res.status).toEqual(200)
  }),

  test("Post a new Post", async () => {
    const res = await request(app).post('/posts').send(testPost)
    const comment: Comment = {
      owner: res.body.comments[0].owner,
      text: res.body.comments[0].text
    }
    const post: Post = {comments: [comment], description: res.body.description, owner: res.body.owner}
    expect(post).toStrictEqual(testPost)
    expect(res.status).toEqual(201)
    testPost._id = res.body._id
  }),

  test("Update a post", async () => {
    const newDescription = "Wow a new description"

    const newPost: Post = {
      _id: testPost._id,
      owner: testPost.owner,
      description: "Wow a new description",
      comments: testPost.comments
    }
    
    const res = await request(app).put(`/posts/${testPost._id}`).send(newPost)
    const post: Post = res.body;
    expect(post.description).toEqual(newDescription)
  })

  test("Comment on a post", async () => {
    const comment: Comment = {
      owner: testPost.owner,
      text: "I made a great post! Im so great!"
    }

    const res = await request(app).put(`/posts/comment/${testPost._id}`).send(comment)
    const post: Post = res.body
    expect(res.status).toBe(201)
    expect(post.comments).toHaveLength(2)
    expect(post.comments[1].owner).toBe(testPost.owner)
    expect(post.comments[1].text).toBe("I made a great post! Im so great!")
  })

  test("Delete post", async () => {
    const res = await request(app).delete(`/posts/${testPost._id}`)
    expect(res.status).toBe(200)

    const getRes = await request(app).get(`/posts`)
    expect(getRes.body).toStrictEqual([])
  })
})
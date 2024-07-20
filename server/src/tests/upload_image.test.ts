import app from '../app'; 
import path from 'path'; 
import request from 'supertest';

describe("File Tests" , () => {
  test("upload file" , async () => {
    const filePath = `${__dirname }/avatar.jpeg`;
    try {
      const response = await request(app).post("/posts/images?file=123.jpeg" ).attach('file', filePath)
      expect(response.statusCode ).toEqual(200);
      let url = response.body.url;
      url = url.replace(/^.*\/\/[^/]+/, '')
      const res = await request(app).get(url)
      expect(res.statusCode ).toEqual(200);
    } catch (err) {
      console.log(err);
      expect(1).toEqual(2);
    }
  })
})
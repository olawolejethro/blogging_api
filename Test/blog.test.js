const mongoose = require("mongoose");
const supertest = require("supertest");
jest.setTimeout(30000);
require("dotenv").config();
const BLOG_TEST_CONNECTION_URL = process.env.BLOG_TEST_CONNECTION_URL;
const app = require("../app");

const TEST_TOKEN = process.env.TEST_TOKEN;

let Blog;

beforeAll((done) => {
  mongoose.connect(BLOG_TEST_CONNECTION_URL);
  mongoose.connection.on("connected", async () => {
    console.log("connected to Mongodb successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err);
    console.log("An error occured");
  });
  done();
});
afterAll((done) => {
  // mongoose.connection.db.dropDatabase(() => {
  mongoose.connection.close(() => done());
  // });
});

//BLOG ROUTE TESTING

describe("/blogs", () => {
  let blogId;
  it("POST/blogs", async () => {
    const body = {
      title: "blog 5",
      body: "i am realy, my name is olawole jethro",
      description: "am new jhf sdsdd jdjs jfjf here",
      tags: "campaign",
      author: "jetpack",
    };

    const response = await supertest(app)
      .post("/blogs")
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send(body);
    blogId = response.body.newBlog._id;
    expect(response.status).toBe(201);
    expect(response.body.newBlog.title).toBe("blog 5");
    expect(response.body.status).toBe("success");
    expect(response.body.newBlog.state).toBe("draft");
  });

  it("GET/blogs?id", async () => {
    const response = await supertest(app)
      .get(`/blogs/${blogId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);
    expect(response.status).toBe(200);
    expect(response.body.Blog).toHaveProperty("author");
  });

  it("UPDATE/blogs", async () => {
    const blogData = {
      state: "published",
    };
    const response = await supertest(app)
      .patch(`/blogs/${blogId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send(blogData);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
  });

  it("DELETE/blogs/blogId", async () => {
    const response = await supertest(app)
      .delete(`/blogs/${blogId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    // console.log(response.body);
    expect(response.status).toBe(204);
  });
});

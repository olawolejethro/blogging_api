const mongoose = require("mongoose");
const supertest = require("supertest");
require("dotenv").config();
const TEST_TOKEN = process.env.TEST_TOKEN;
const BLOG_TEST_CONNECTION_URL = process.env.BLOG_TEST_CONNECTION_URL;
const app = require("../app");

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
  //   mongoose.connection.db.dropDatabase(() => {
  mongoose.connection.close(() => done());
  //   });
});

describe("sign up", () => {
  let userId;
  it("POST /", async () => {
    const userDetails = {
      first_name: "olawole",
      last_name: "jethro",
      email: "jetpac@gmail.com",
      password: "olawes",
    };
    const response = await supertest(app)
      .post("/signup")
      .set("content-type", "application/json")
      .send(userDetails);

    userId = response.body.user._id;
    console.log(userId);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Signup successfull");
    expect(response.body).toHaveProperty("user");
  });

  it("GET  users/", async () => {
    const response = await supertest(app)
      .get("/users")
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.result).toBeGreaterThanOrEqual(0);
  });

  it("GET by ID  user/", async () => {
    const response = await supertest(app)
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(JSON.parse("true"));
    expect(response.body).toHaveProperty("user");
  });

  it("UPDATE user by ID  /", async () => {
    const user_data = {
      email: "demo@gmail.come",
    };
    const response = await supertest(app)
      .patch(`/users/${userId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send(user_data);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(JSON.parse("true"));
  });

  it("DELETE user by ID  /", async () => {
    const response = await supertest(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(JSON.parse("true"));
    expect(response.body).toHaveProperty("user");
  });
});

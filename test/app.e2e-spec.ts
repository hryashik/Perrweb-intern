import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

let app: INestApplication;
let server;
let token;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
  server = app.getHttpServer();
});

const correct_user_data = {
  email: "test@test.ru",
  password: "test123",
  username: "testuser",
};

afterAll(async () => {
  await app.close();
});

describe("/auth", () => {
  describe("/signup (POST)", () => {
    test("Should return 400", async () => {
      const resp = await request(server)
        .post("/auth/signup")
        .send({ email: "asd" });
      expect(resp.statusCode).toBe(400);
      const resp2 = await request(server)
        .post("/auth/signup")
        .send({ username: "asd" });
      expect(resp2.statusCode).toBe(400);
      const resp3 = await request(server)
        .post("/auth/signup")
        .send({ ...correct_user_data, email: "t@t.r" });
      expect(resp3.statusCode).toBe(400);
    });
    test("Should return 201", async () => {
      const resp = await request(server)
        .post("/auth/signup")
        .send(correct_user_data);
      expect(resp.statusCode).toBe(201);
      expect(resp.body.access_token).toBeDefined();
    });
    test("Should return 409", async () => {
      const resp = await request(server)
        .post("/auth/signup")
        .send(correct_user_data);
      expect(resp.statusCode).toBe(409);
    });
  });
  describe("/login (POST)", () => {
    test("Should return 400", async () => {
      const resp = await request(server)
        .post("/auth/login")
        .send({ email: "asd" });
      expect(resp.statusCode).toBe(400);
      const resp2 = await request(server)
        .post("/auth/login")
        .send({ password: "123123" });
      expect(resp2.statusCode).toBe(400);
    });
    test("Should return 401", async () => {
      const resp = await request(server).post("/auth/login").send({
        email: correct_user_data.email,
        password: "test456",
      });
      expect(resp.statusCode).toBe(401);
    });
    test("Should return 200", async () => {
      const resp = await request(server).post("/auth/login").send({
        email: correct_user_data.email,
        password: correct_user_data.password,
      });
      expect(resp.statusCode).toBe(200);
      token = resp.body.access_token;
      expect(token).toBeDefined();
    });
  });
});

describe("/users", () => {
  describe("/users/:id (GET)", () => {
    describe("Incorrect id", () => {
      test("Should return 400", async () => {
        const res = await request(server)
          .get("/users/asd")
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
      });
    });
    describe("No authorization header", () => {
      test("Should return 401", async () => {
        const res = await request(server).get("/users/1");
        expect(res.statusCode).toBe(401);
      });
    });
    describe("Incorrect token", () => {
      test("Should return 401", async () => {
        const res = await request(server)
          .get("/users/1")
          .set("Authorization", `Bearer: asdkjsk2j13jkszx}`);
        expect(res.statusCode).toBe(401);
      });
    });
    test("should return 404", async () => {
      const res = await request(server)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
      const res2 = await request(server)
        .get("/users/333")
        .set("Authorization", `Bearer ${token}`);
      expect(res2.statusCode).toBe(404);
    });
    test("should return 200", async () => {
      const res = await request(server)
        .get("/users/1")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("username");
      expect(res.body).toHaveProperty("email");
      expect(res.body).toHaveProperty("id");
      expect(res.body).not.toHaveProperty("hash");
      expect(res.body).not.toHaveProperty("password");
    });
  });
});

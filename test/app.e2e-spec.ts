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

const column_data = { title: "my first column", position: 1 };
let columnId;

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
    describe("No userid or user not defined", () => {
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
    });
    describe("Correct request", () => {
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
  describe("/users/:id (PATCH)", () => {
    describe("Incorrect id", () => {
      test("Should return 400", async () => {
        const res = await request(server)
          .patch("/users/asd")
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
      });
    });
    describe("No authorization header", () => {
      test("Should return 401", async () => {
        const res = await request(server).patch("/users/1");
        expect(res.statusCode).toBe(401);
      });
    });
    describe("Incorrect token", () => {
      test("Should return 401", async () => {
        const res = await request(server)
          .patch("/users/1")
          .set("Authorization", `Bearer: asdkjsk2j13jkszx}`);
        expect(res.statusCode).toBe(401);
      });
    });
    describe("No userid", () => {
      test("should return 404", async () => {
        const res = await request(server)
          .patch("/users")
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
      });
    });
    describe("No permissions", () => {
      test("Should return 403", async () => {
        const res2 = await request(server)
          .patch("/users/333")
          .set("Authorization", `Bearer ${token}`);
        expect(res2.statusCode).toBe(403);
      });
    });
    describe("Correct requst", () => {
      test("Should return 201", async () => {
        const res = await request(server)
          .patch("/users/1")
          .set("Authorization", `Bearer ${token}`)
          .send({
            email: correct_user_data.email,
            password: correct_user_data.password,
            username: "testtest",
          });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("username", "testtest");
        correct_user_data.username = "testtest";
      });
    });
  });
});

describe("/columns", () => {
  describe("/ (POST)", () => {
    describe("Bad request, no data", () => {
      test("Should return 400", async () => {
        const resp = await request(server)
          .post("/columns")
          .send({ title: "" })
          .set("Authorization", `Bearer ${token}`);
        const resp2 = await request(server)
          .post("/columns")
          .send({ title: column_data.title })
          .set("Authorization", `Bearer ${token}`);
        const resp3 = await request(server)
          .post("/columns")
          .send({ position: 1 })
          .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(400);
        expect(resp2.statusCode).toBe(400);
        expect(resp3.statusCode).toBe(400);
      });
    });
    describe("Unauthorized", () => {
      test("Should return 401", async () => {
        const resp = await request(server).post("/columns").send(column_data);
        expect(resp.statusCode).toBe(401);
      });
    });
    describe("Correct request", () => {
      test("Should return 201", async () => {
        const resp = await request(server)
          .post("/columns")
          .send(column_data)
          .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toHaveProperty("id");
        columnId = resp.body.id;
      });
    });
  });
});

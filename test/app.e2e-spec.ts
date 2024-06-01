import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

let app: INestApplication;
let server;

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
    });
    test("Should return 409", async () => {
      const resp = await request(server)
        .post("/auth/signup")
        .send(correct_user_data);
      expect(resp.statusCode).toBe(409);
    });
  });
});

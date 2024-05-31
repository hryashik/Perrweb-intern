import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

let app: INestApplication;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

const correct_user_data = {
  email: "test@test.ru",
  password: "test123",
  username: "testuser",
};

afterAll(async () => {
  await app.close();
});

describe("AuthController", () => {
  test("/auth/signup (POST)", async () => {
    const resp = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "asd" });
    expect(resp.statusCode).toBe(400);
  });
});

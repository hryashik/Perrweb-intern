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
const card_data = { column_id: 1, position: 1, title: "first card" };
let card_id;
let columnId;
let comment_id;

afterAll(async () => {
  await app.close();
});

describe("auth", () => {
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

describe("users", () => {
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

describe("columns", () => {
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
  describe("/:columnId (GET)", () => {
    describe("Bad request, no data", () => {
      test("Should return 400", async () => {
        const resp = await request(server)
          .get("/columns/asd")
          .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(400);
      });
    });
    describe("Unauthorized", () => {
      test("Should return 401", async () => {
        const resp = await request(server).get("/columns/1");
        expect(resp.statusCode).toBe(401);
      });
    });
    describe("Correct request", () => {
      test("Should return 200", async () => {
        const resp = await request(server)
          .get("/columns/1")
          .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toHaveProperty("id");
        expect(resp.body).toHaveProperty("title");
      });
    });
    describe("Correct request", () => {
      test("Should return 200", async () => {
        const resp = await request(server)
          .get("/users/1/columns/1")
          .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toHaveProperty("id");
        expect(resp.body).toHaveProperty("title");
      });
    });
    describe("Get all columns", () => {
      test("Should return 200", async () => {
        const resp = await request(server)
          .get("/users/1/columns")
          .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body.length).toBeGreaterThan(0);
      });
      test("Should return 200", async () => {
        const resp = await request(server)
          .get("/columns")
          .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body.length).toBeGreaterThan(0);
      });
    });
  });
  describe("/:columnId (PATCH)", () => {
    describe("Bad request, no data", () => {
      test("Should return 400", async () => {
        const resp = await request(server)
          .patch("/columns/asd")
          .send({ title: "updated" })
          .set("Authorization", `Bearer ${token}`);
        const resp2 = await request(server)
          .patch("/columns/0")
          .send({ title: "updated" })
          .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(400);
        expect(resp2.statusCode).toBe(400);
      });
    });
    describe("Unauthorized", () => {
      test("Should return 401", async () => {
        const resp = await request(server)
          .patch("/columns/1")
          .send({ title: "updated" });
        expect(resp.statusCode).toBe(401);
      });
    });
    describe("Permission denied", () => {
      test("Should return 403", async () => {
        const resp = await request(server)
          .patch("/columns/15")
          .send({ title: "updated" })
          .set("Authorization", `Bearer ${token}`);
        const resp2 = await request(server)
          .patch("/users/15/columns/1")
          .send({ title: "updated" })
          .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(403);
        expect(resp2.statusCode).toBe(403);
      });
    });
    describe("Correct request", () => {
      test("Should return 201", async () => {
        const resp = await request(server)
          .patch("/columns/1")
          .send({ title: "updated" })
          .set("Authorization", `Bearer ${token}`);
        const resp2 = await request(server)
          .patch("/users/1/columns/1")
          .send({ title: "updated" })
          .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toHaveProperty("id");
        expect(resp2.statusCode).toBe(201);
        expect(resp2.body).toHaveProperty("id");
      });
    });
  });
  describe("/:columnId (DELETE)", () => {
    describe("Bad request, no data", () => {
      test("Should return 400", async () => {
        const resp = await request(server)
          .delete("/columns/asd")
          .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(400);
      });
    });
    describe("Unauthorized", () => {
      test("Should return 401", async () => {
        const resp = await request(server).delete("/columns/1");
        const resp2 = await request(server).delete("/users/1/columns/1");
        expect(resp.statusCode).toBe(401);
        expect(resp2.statusCode).toBe(401);
      });
    });
    describe("Permission denied", () => {
      test("Should return 403", async () => {
        const resp = await request(server)
          .delete("/columns/15")
          .set("Authorization", `Bearer ${token}`);
        const resp2 = await request(server)
          .delete("/users/15/columns/1")
          .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(403);
        expect(resp2.statusCode).toBe(403);
      });
    });
    describe("Correct request", () => {
      test("Should return 200", async () => {
        const resp = await request(server)
          .delete("/columns/1")
          .set("Authorization", `Bearer ${token}`);
        const column = await request(server)
          .post("/columns")
          .send(column_data)
          .set("Authorization", `Bearer ${token}`);
        const resp2 = await request(server)
          .delete(`/users/1/columns/${column.body.id}`)
          .set("Authorization", `Bearer ${token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp2.statusCode).toBe(200);
        const col = await request(server)
          .post("/columns")
          .send(column_data)
          .set("Authorization", `Bearer ${token}`);
        card_data.column_id = col.body.id;
        columnId = col.body.id;
      });
    });
  });
});

describe("cards", () => {
  describe("/cards (POST)", () => {
    describe("Incorrect data", () => {
      test("Should return 400", async () => {
        const res = await request(server)
          .post("/cards")
          .send({
            column_id: card_data.column_id,
            position: 1,
          })
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
      });
    });
    describe("Unauthorized", () => {
      test("Should return 401", async () => {
        const res = await request(server).post("/cards").send({
          column_id: card_data.column_id,
          position: 1,
          title: "first card",
        });
        expect(res.statusCode).toBe(401);
      });
    });
    describe("Column doesn't exist", () => {
      test("Should return 404", async () => {
        const res = await request(server)
          .post("/cards")
          .send({ ...card_data, column_id: 100 })
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
      });
    });
    describe("Correct request", () => {
      test("Should return 201", async () => {
        const res = await request(server)
          .post("/cards")
          .send(card_data)
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("column_id");
        expect(res.body).toHaveProperty("position");
        card_id = res.body.id;
      });
    });
  });
  describe("/cards (GET)", () => {
    describe("Unauthorized", () => {
      test("Should return 401", async () => {
        const res = await request(server).get("/cards");
        expect(res.statusCode).toBe(401);
      });
    });
    describe("Correct request", () => {
      test("Should return 200", async () => {
        const res = await request(server)
          .get("/cards")
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
      });
    });
  });
  describe("/columns/:columnid/cards (GET)", () => {
    describe("Incorrect columnid", () => {
      test("Should return 404", async () => {
        const res = await request(server)
          .get("/columns/29/cards")
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
      });
    });
    describe("Correct request", () => {
      test("Should return 200", async () => {
        const res = await request(server)
          .get(`/columns/${columnId}/cards`)
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
      });
    });
  });
  describe("/cards/:cardid $(PATCH)", () => {
    describe("Bad data", () => {
      test("Should return 400", async () => {
        const res = await request(server)
          .patch(`/cards/${card_id}`)
          .send({ position: "asd" })
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
      });
    });
    describe("Unauthorized", () => {
      test("Should return 400", async () => {
        const res = await request(server)
          .patch(`/cards/${card_id}`)
          .send({ position: 5 });
        expect(res.statusCode).toBe(401);
      });
    });
    describe("Permission denied", () => {
      test("Should return 403", async () => {
        const user = await request(server).post("/auth/signup").send({
          email: "asdasdas@mail.ru",
          username: "sadasdasd",
          password: "sad213",
        });
        const token2 = user.body.access_token;
        const createColumn = await request(server)
          .post("/columns")
          .send(column_data)
          .set("Authorization", `Bearer ${token2}`);
        expect(createColumn.statusCode).toBe(201);

        const createCard = await request(server)
          .post("/cards")
          .send({ ...card_data, column_id: createColumn.body.id })
          .set("Authorization", `Bearer ${token2}`);

        const res = await request(server)
          .patch(`/cards/${createCard.body.id}`)
          .send({ position: 5 })
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(403);
        const res2 = await request(server)
          .patch(`/columns/${createColumn.body.id}/cards/${createCard.body.id}`)
          .send({ position: 5 })
          .set("Authorization", `Bearer ${token}`);
        console.log(res2.body);
        expect(res2.statusCode).toBe(403);
      });
    });
    describe("Card doesn't exist", () => {
      test("Should return 404", async () => {
        const res = await request(server)
          .patch(`/cards/25`)
          .send({ position: 10 })
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
      });
    });
    describe("Correct request", () => {
      test("Should return 200", async () => {
        const res = await request(server)
          .patch(`/cards/${card_id}`)
          .send({ position: 10 })
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
      });
    });
  });
  describe("/cards/:cardid $(DELETE)", () => {
    describe("Bad data", () => {
      test("Should return 400", async () => {
        const res = await request(server)
          .delete(`/cards/asd`)
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
      });
    });
    describe("Unauthorized", () => {
      test("Should return 401", async () => {
        const res = await request(server).delete(`/cards/${card_id}`);
        expect(res.statusCode).toBe(401);
      });
    });
    describe("Permission denied", () => {
      test("Should return 403", async () => {
        const res = await request(server)
          .delete(`/cards/3`)
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(403);
        const res2 = await request(server)
          .delete(`/columns/4/cards/3`)
          .set("Authorization", `Bearer ${token}`);
        expect(res2.statusCode).toBe(403);
      });
    });
    describe("Card doesn't exist", () => {
      test("Should return 404", async () => {
        const res = await request(server)
          .delete(`/cards/25`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
      });
    });
    describe("Correct request", () => {
      test("Should return 200", async () => {
        const res = await request(server)
          .delete(`/cards/${card_id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
      });
    });
  });
});

describe("comments", () => {
  describe("/comments (POST)", () => {
    describe("Bad data", () => {
      test("Should return 400", async () => {
        const createCard = await request(server)
          .post("/cards")
          .set("Authorization", `Bearer ${token}`)
          .send({ column_id: columnId, title: "zxc", position: 5 });
        expect(createCard.statusCode).toBe(201);
        card_id = createCard.body.id;
        const res = await request(server)
          .post("/comments")
          .set("Authorization", `Bearer ${token}`)
          .send({ content: "" });
        expect(res.statusCode).toBe(400);
      });
    });
    describe("Unauthorized", () => {
      test("Should return", async () => {
        const res = await request(server)
          .post("/comments")
          .send({ content: "asd" });
        expect(res.statusCode).toBe(401);
      });
    });
    describe("Correct data", () => {
      test("Should return 201", async () => {
        const res = await request(server)
          .post("/comments")
          .set("Authorization", `Bearer ${token}`)
          .send({ content: "qweasdzxc", card_id: card_id });
        expect(res.statusCode).toBe(201);
        comment_id = res.body.id;
        expect(comment_id).toBeGreaterThan(0);
      });
    });
  });
  describe("/comments (GET)", () => {
    describe("Unauthorized", () => {
      test("Should return", async () => {
        const res = await request(server).get("/comments");
        expect(res.statusCode).toBe(401);
      });
    });
    describe("Correct request", () => {
      test("Should return 200", async () => {
        const res = await request(server)
          .get("/comments")
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
      });
    });
  });
  describe("/comments/:id (GET)", () => {
    describe("Unauthorized", () => {
      test("Should return", async () => {
        const res = await request(server).get("/comments/1");
        expect(res.statusCode).toBe(401);
      });
    });
    describe("Correct request", () => {
      test("Should return 200", async () => {
        const res = await request(server)
          .get(`/comments/${comment_id}`)
          .set("Authorization", `Bearer ${token}`);
        const res2 = await request(server)
          .get(`/cards/${card_id}/comments`)
          .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBeDefined();
        expect(res2.statusCode).toBe(200);
      });
    });
  });
  describe("/comments/:id (DELETE)", () => {
    describe("Unauthorized", () => {
      test("Should return", async () => {
        const res = await request(server).delete("/comments/1");
        expect(res.statusCode).toBe(401);
      });
    });

    describe("Not found comment", () => {
      test("Should return 404", async () => {
        const res = await request(server)
          .delete(`/comments/222`)
          .set("Authorization", `Bearer ${token}`);
        console.log(res.body);
        expect(res.statusCode).toBe(404);
      });
    });

    describe("Correct request", () => {
      test("Should return 200", async () => {
        const res = await request(server)
          .delete(`/comments/${comment_id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
      });
    });
  });
});

import { Elysia, t } from "elysia";

export const app = new Elysia({ prefix: "/api" })
  .get("/", "hello from Elysia")
  .get("/user/:id", ({ params: { id } }) => id, {
    params: t.Object({
      id: t.Number(),
    }),
  })
  .post("/", ({ body }) => body, {
    body: t.Object({
      name: t.String(),
      age: t.Number(),
    }),
  });

export type App = typeof app;
export const GET = app.fetch;
export const POST = app.fetch;

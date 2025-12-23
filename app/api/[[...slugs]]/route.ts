// app/api/todos/[[...slugs]]/route.ts
import type { Prisma } from "@/lib/generated/prisma/client.js";
import {
  TodoPlain,
  TodoPlainInputCreate,
} from "@/lib/generated/prismabox/Todo";
import { prisma } from "@/lib/prisma";
import { Elysia, t } from "elysia";

export const app = new Elysia({ prefix: "/api/todos" })

  // GET /api/todos - Get all todos with optional filters
  .get(
    "/",
    async ({ query }) => {
      const { completed, search } = query;

      // Build where clause safely
      const where: Prisma.TodoWhereInput = {};

      // Parse completed query parameter
      if (completed !== undefined) {
        const completedStr = completed.toString().toLowerCase();
        where.completed = completedStr === "true" || completedStr === "1";
      }

      // Add search condition if provided
      if (search && search.trim().length > 0) {
        where.title = {
          contains: search.trim(),
          mode: "insensitive" as const, // Type assertion
        };
      }

      try {
        const todos = await prisma.todo.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
        });

        return todos;
      } catch (error) {
        console.error("Error fetching todos:", error);
        throw new Error("Failed to fetch todos");
      }
    },
    {
      query: t.Object({
        completed: t.Optional(t.String()),
        search: t.Optional(t.String()),
      }),
      response: t.Array(TodoPlain),
    }
  )

  // ... other routes remain the same
  .get(
    "/:id",
    async ({ params: { id }, status }) => {
      const todo = await prisma.todo.findUnique({
        where: { id: Number(id) },
      });

      if (!todo) {
        return status(404, { error: "Todo not found" });
      }

      return todo;
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      response: {
        200: TodoPlain,
        404: t.Object({
          error: t.String(),
        }),
      },
    }
  )

  // POST /api/todos - Create todo
  .post(
    "/",
    async ({ body }) => {
      const todo = await prisma.todo.create({
        data: body,
      });
      return todo;
    },
    {
      body: TodoPlainInputCreate,
      response: TodoPlain,
    }
  )

  // PUT /api/todos/:id - Update todo
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      const todo = await prisma.todo.update({
        where: { id: Number(id) },
        data: body,
      });
      return todo;
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      body: t.Object({
        title: t.Optional(t.String()),
        completed: t.Optional(t.Boolean()),
      }),
      response: TodoPlain,
    }
  )

  // DELETE /api/todos/:id - Delete todo
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      const todo = await prisma.todo.delete({
        where: { id: Number(id) },
      });
      return {
        success: true,
        message: `Todo "${todo.title}" deleted`,
      };
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
      }),
    }
  )

  // PATCH /api/todos/:id/toggle - Toggle todo completion
  .patch(
    "/:id/toggle",
    async ({ params: { id } }) => {
      const todo = await prisma.todo.findUnique({
        where: { id: Number(id) },
      });

      if (!todo) {
        throw new Error("Todo not found");
      }

      const updatedTodo = await prisma.todo.update({
        where: { id: Number(id) },
        data: { completed: !todo.completed },
      });

      return updatedTodo;
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      response: TodoPlain,
    }
  );

export type App = typeof app;
export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;
export const PATCH = app.fetch;

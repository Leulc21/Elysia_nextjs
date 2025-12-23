// app/page.tsx
import { api } from "@/lib/eden";
import Link from "next/link";

export default async function Home() {
  // Fetch todos from your Elysia API
  const { data: todos, error } = await api.todos.get();

  if (error) {
    console.error("Failed to fetch todos:", error);
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Error Loading Todos
          </h1>
          <p className="text-gray-700">
            {error?.value?.message ?? (typeof error === "string" ? error : JSON.stringify(error))}
          </p>
        </div>
      </div>
    );
  }

  const todoList = todos || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            📝 Todo List
          </h1>
          <p className="text-gray-600">
            A simple Todo app built with Next.js, Elysia, and Prisma
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-3xl font-bold text-blue-600">
              {todoList.length}
            </div>
            <div className="text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-3xl font-bold text-green-600">
              {todoList.filter((todo) => todo.completed).length}
            </div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-3xl font-bold text-orange-600">
              {todoList.filter((todo) => !todo.completed).length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
        </div>

        {/* Create Todo Form - Client Component */}
        <div className="mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Todo
            </h2>
            <form action="/api/todos" method="POST" className="space-y-4">
              <div>
                <input
                  type="text"
                  name="title"
                  placeholder="What needs to be done?"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Todo
              </button>
            </form>
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {todoList.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No todos yet!
              </h3>
              <p className="text-gray-500">
                Add your first todo above to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {todoList.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-6 hover:bg-gray-50 transition ${
                    todo.completed ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <form
                      action={`/api/todos/${todo.id}/toggle`}
                      method="PATCH"
                    >
                      <button
                        type="submit"
                        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          todo.completed
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 hover:border-blue-500"
                        }`}
                        aria-label={
                          todo.completed
                            ? "Mark as incomplete"
                            : "Mark as complete"
                        }
                      >
                        {todo.completed && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    </form>

                    {/* Todo Content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg font-medium ${
                          todo.completed
                            ? "text-gray-500 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {todo.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>ID: {todo.id}</span>
                        <span>•</span>
                        <span>
                          Created:{" "}
                          {new Date(todo.createdAt).toLocaleDateString()}
                        </span>
                        {todo.completed && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">
                              Completed
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <form action={`/api/todos/${todo.id}`} method="DELETE">
                        <button
                          type="submit"
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          aria-label="Delete todo"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Testing Section */}
        <div className="mt-12 bg-gray-900 text-white rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">API Testing</h2>
          <p className="text-gray-300 mb-6">
            Test your Elysia API endpoints directly:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-mono text-green-400 mb-2">GET /api/todos</h3>
              <p className="text-sm text-gray-400">Fetch all todos</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-mono text-blue-400 mb-2">POST /api/todos</h3>
              <p className="text-sm text-gray-400">Create new todo</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-mono text-yellow-400 mb-2">
                PUT /api/todos/:id
              </h3>
              <p className="text-sm text-gray-400">Update todo</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-mono text-red-400 mb-2">
                DELETE /api/todos/:id
              </h3>
              <p className="text-sm text-gray-400">Delete todo</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>
            Built with ❤️ using{" "}
            <Link
              href="https://nextjs.org"
              className="text-blue-600 hover:underline"
            >
              Next.js
            </Link>
            ,{" "}
            <Link
              href="https://elysiajs.com"
              className="text-blue-600 hover:underline"
            >
              Elysia
            </Link>
            , and{" "}
            <Link
              href="https://prisma.io"
              className="text-blue-600 hover:underline"
            >
              Prisma
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

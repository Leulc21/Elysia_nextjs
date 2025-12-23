// app/components/TodoForm.tsx
"use client";

import { api } from "@/lib/eden"; // Import api instead
import { useState } from "react";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      // Use api directly (this only works on server-side)
      const response = await api.todos.post({
        title: title.trim(),
      });

      if (response.error) {
        const errorValue = response.error.value;
        const errorMessage =
          typeof errorValue === "string"
            ? errorValue
            : errorValue?.message ||
              errorValue?.summary ||
              "Failed to create todo";
        alert(`Error: ${errorMessage}`);
        return;
      }

      // Clear input and refresh the page to show new todo
      setTitle("");
      window.location.reload();
    } catch (error) {
      console.error("Failed to create todo:", error);
      alert("Failed to create todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          disabled={loading}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Adding..." : "Add Todo"}
      </button>
    </form>
  );
}

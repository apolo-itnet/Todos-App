"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { todoSchema, TodoInput } from "@/lib/validations/todo";
import { getTodos, createTodo, updateTodo, deleteTodo } from "@/lib/api";
import { Todo } from "@/types/todo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function TodosApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);

  const form = useForm<TodoInput>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
      completed: false,
    },
    mode: "onSubmit",
  });

  //Load Todos
  const loadTodos = async () => {
    try {
      const res = await getTodos();
      setTodos(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  //Submit Handler
  const onSubmit = async (values: TodoInput) => {
    try {
      if (editId) {
        await updateTodo(editId, values as Todo);
        toast.success("Todo updated!");
      } else {
        await createTodo(values as Todo);
        toast.success("Todo added!");
      }
      form.reset();
      setEditId(null);
      loadTodos();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  //Edit Handler
  const handleEdit = (todo: Todo) => {
    if (!todo.id) return;
    setEditId(todo.id);
    form.setValue("title", todo.title);
    form.setValue("description", todo.description || "");
    form.setValue("completed", todo.completed);
  };

  //Delete Handler
  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await deleteTodo(id);
      toast.success("Todo deleted!");
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
      {/* Header */}
      <h1 className="text-center text-3xl font-bold">📝 Todos Application</h1>

      {/* Form Section */}
      <Card className="shadow-lg border border-gray-200 rounded-2xl">
        <CardHeader>
          <CardTitle>{editId ? "✏️ Edit Todo" : "➕ Create New Todo"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter todo title..."
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Optional description..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Completed Checkbox */}
              <FormField
                control={form.control}
                name="completed"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(Boolean(checked))
                        }
                      />
                    </FormControl>
                    <FormLabel>Mark as Completed</FormLabel>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-indigo-500 rounded-lg text-white hover:bg-indigo-600 transition-colors duration-300 ease-in-out cursor-pointer"
              >
                {editId ? "Update Todo" : "Add Todo"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Todo List Section */}
      <Card className="shadow-lg border border-gray-200 rounded-2xl">
        <CardHeader>
          <CardTitle>📋 Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : todos.length === 0 ? (
            <p className="text-center text-gray-500">No todos found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-left">
                      Title
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-left">
                      Status
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {todos.map((todo) => (
                    <tr
                      key={todo.id}
                      className="hover:bg-gray-50 transition-all"
                    >
                      <td className="border border-gray-200 px-4 py-2">
                        {todo.title}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {todo.completed ? (
                          <span className="text-green-600 font-medium">
                            ✅ Done
                          </span>
                        ) : (
                          <span className="text-red-500 font-medium">
                            ❌ Not Done
                          </span>
                        )}
                      </td>
                      <td className="flex items-center justify-center border border-gray-200 px-4 py-2 space-x-2">
                        <Button
                          onClick={() => handleEdit(todo)}
                          className="bg-indigo-500 rounded-lg text-white hover:bg-indigo-600 transition-colors duration-300 ease-in-out cursor-pointer"
                          type="button"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(todo.id)}
                          className="bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors duration-300 ease-in-out cursor-pointer"
                          type="button"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

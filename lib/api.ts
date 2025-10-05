import axios from "axios";
import { Todo } from "@/types/todo";

const api = axios.create({
  baseURL: "http://localhost:3002",
});

export const getTodos = () => api.get<Todo[]>("/todos");
export const createTodo = (data: Todo) => api.post<Todo>("/todos", data);
export const updateTodo = (id: number, data: Todo) => api.put<Todo>(`/todos/${id}`, data);
export const deleteTodo = (id: number) => api.delete(`/todos/${id}`);

export default api;

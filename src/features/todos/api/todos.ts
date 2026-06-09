import { apiClient } from '../../../lib/api/client'
import type { Todo, TodoPayload } from '../types/todo'

export function getTodos(token: string | null) {
  return apiClient.get<Todo[]>('/api/todolists', token)
}

export function createTodo(payload: TodoPayload, token: string | null) {
  return apiClient.post<Todo, TodoPayload>('/api/todolists', payload, token)
}

export function updateTodo(
  id: number,
  payload: TodoPayload,
  token: string | null,
) {
  return apiClient.put<Todo, TodoPayload>(`/api/todolists/${id}`, payload, token)
}

export function deleteTodo(id: number, token: string | null) {
  return apiClient.delete(`/api/todolists/${id}`, token)
}

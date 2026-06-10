import { apiClient } from './client'
import type {
  CreateTodoListPayload,
  TodoItemInput,
  TodoList,
  UpdateTodoListPayload,
} from '../features/todolists/types'

export async function getTodoLists() {
  const response = await apiClient.get<TodoList[]>('/api/todolists')
  return response.data
}

export async function createTodoList(payload: CreateTodoListPayload) {
  const response = await apiClient.post<TodoList>('/api/todolists', payload)
  return response.data
}

export async function updateTodoList(id: number, payload: UpdateTodoListPayload) {
  const response = await apiClient.put<TodoList>(`/api/todolists/${id}`, payload)
  return response.data
}

export async function deleteTodoList(id: number) {
  await apiClient.delete(`/api/todolists/${id}`)
}

export async function syncTodos() {
  const response = await apiClient.post<{
    success: boolean
    created: number
    failed: number
    message?: string
  }>('/api/todolists/sync')
  return response.data
}

export async function updateTodoItem(
  todoList: TodoList,
  itemId: number,
  itemPatch: Partial<TodoItemInput>,
) {
  const items = todoList.items.map((item) =>
    item.id === itemId
      ? {
          name: itemPatch.name ?? item.name,
          completed: itemPatch.completed ?? item.completed,
        }
      : {
          name: item.name,
          completed: item.completed,
        },
  )

  return updateTodoList(todoList.id, {
    name: todoList.name,
    items,
  })
}

export async function deleteTodoItem(todoList: TodoList, itemId: number) {
  const items = todoList.items
    .filter((item) => item.id !== itemId)
    .map((item) => ({
      name: item.name,
      completed: item.completed,
    }))

  return updateTodoList(todoList.id, {
    name: todoList.name,
    items,
  })
}

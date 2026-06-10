export type TodoItem = {
  completed: boolean
  id: number
  name: string
}

export type TodoItemInput = {
  completed: boolean
  name: string
}

export type TodoList = {
  id: number
  items: TodoItem[]
  name: string
}

export type CreateTodoListPayload = {
  items: TodoItemInput[]
  name: string
}

export type UpdateTodoListPayload = {
  items?: TodoItemInput[]
  name?: string
}

import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import {
  createTodoList,
  deleteTodoItem,
  deleteTodoList,
  getTodoLists,
  updateTodoItem,
  updateTodoList,
} from '../api/todoLists'
import type {
  CreateTodoListPayload,
  TodoItemInput,
  TodoList,
  UpdateTodoListPayload,
} from '../features/todolists/types'

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong while talking to the API.'
}

export function useTodoLists() {
  const [todoLists, setTodoLists] = useState<TodoList[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeListId, setActiveListId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [formErrorMessage, setFormErrorMessage] = useState('')
  const [actionErrorMessage, setActionErrorMessage] = useState('')

  async function loadTodoLists() {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const data = await getTodoLists()
      setTodoLists(data)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  async function submitTodoList(payload: CreateTodoListPayload) {
    setIsSubmitting(true)
    setFormErrorMessage('')

    try {
      await createTodoList(payload)
      await loadTodoLists()
    } catch (error) {
      setFormErrorMessage(getApiErrorMessage(error))
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  async function mutateList(
    todoListId: number,
    mutation: () => Promise<unknown>,
  ) {
    setActiveListId(todoListId)
    setActionErrorMessage('')

    try {
      await mutation()
      await loadTodoLists()
    } catch (error) {
      setActionErrorMessage(getApiErrorMessage(error))
      throw error
    } finally {
      setActiveListId(null)
    }
  }

  async function saveTodoList(id: number, payload: UpdateTodoListPayload) {
    await mutateList(id, () => updateTodoList(id, payload))
  }

  async function removeTodoList(id: number) {
    await mutateList(id, () => deleteTodoList(id))
  }

  async function addTodoItem(todoList: TodoList, itemName: string) {
    const items: TodoItemInput[] = [
      ...todoList.items.map((item) => ({
        name: item.name,
        completed: item.completed,
      })),
      {
        name: itemName,
        completed: false,
      },
    ]

    await saveTodoList(todoList.id, {
      name: todoList.name,
      items,
    })
  }

  async function saveTodoItemName(
    todoList: TodoList,
    itemId: number,
    name: string,
  ) {
    await mutateList(todoList.id, () => updateTodoItem(todoList, itemId, { name }))
  }

  async function toggleTodoItemCompleted(
    todoList: TodoList,
    itemId: number,
    completed: boolean,
  ) {
    await mutateList(todoList.id, () =>
      updateTodoItem(todoList, itemId, { completed }),
    )
  }

  async function removeTodoItem(todoList: TodoList, itemId: number) {
    await mutateList(todoList.id, () => deleteTodoItem(todoList, itemId))
  }

  useEffect(() => {
    void loadTodoLists()
  }, [])

  return {
    actionErrorMessage,
    activeListId,
    addTodoItem,
    errorMessage,
    formErrorMessage,
    isLoading,
    isSubmitting,
    loadTodoLists,
    removeTodoItem,
    removeTodoList,
    saveTodoItemName,
    saveTodoList,
    submitTodoList,
    toggleTodoItemCompleted,
    todoLists,
  }
}

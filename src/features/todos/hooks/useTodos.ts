import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuth } from '../../../lib/auth/use-auth'
import { createTodo, deleteTodo, getTodos, updateTodo } from '../api/todos'
import type { TodoPayload } from '../types/todo'

const todosQueryKey = ['todos']

export function useTodos() {
  const { token } = useAuth()

  return useQuery({
    queryKey: [...todosQueryKey, token],
    queryFn: () => getTodos(token),
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation({
    mutationFn: (payload: TodoPayload) => createTodo(payload, token),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todosQueryKey })
    },
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TodoPayload }) =>
      updateTodo(id, payload, token),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todosQueryKey })
    },
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation({
    mutationFn: (id: number) => deleteTodo(id, token),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todosQueryKey })
    },
  })
}

import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorMessage } from '../../../components/ui/ErrorMessage'
import { Input } from '../../../components/ui/Input'
import { Spinner } from '../../../components/ui/Spinner'
import { useAuth } from '../../../lib/auth/use-auth'
import {
  useCreateTodo,
  useDeleteTodo,
  useTodos,
  useUpdateTodo,
} from '../hooks/useTodos'
import { TodoForm } from '../components/TodoForm'
import { TodoList } from '../components/TodoList'
import styles from './TodoPage.module.css'

export function TodoPage() {
  const [draftToken, setDraftToken] = useState('')
  const { clearToken, setToken, token } = useAuth()
  const todosQuery = useTodos()
  const createTodoMutation = useCreateTodo()
  const updateTodoMutation = useUpdateTodo()
  const deleteTodoMutation = useDeleteTodo()

  const errorMessage =
    todosQuery.error instanceof Error
      ? todosQuery.error.message
      : 'Unable to load todo lists right now.'

  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>React + Vite frontend</span>
          <h1>Todo Lists</h1>
          <p>
            A small feature-based app using React Query, reusable UI building
            blocks, CSS Modules, and JWT-ready API requests.
          </p>
        </div>

        <aside className={styles.tokenPanel}>
          <h2>JWT token</h2>
          <p>
            Optional for now. If the backend starts requiring auth, saved tokens
            are automatically sent as a Bearer header.
          </p>
          <div className={styles.tokenControls}>
            <Input
              onChange={(event) => setDraftToken(event.target.value)}
              placeholder="Paste JWT token"
              type="password"
              value={draftToken}
            />
            <div className={styles.tokenActions}>
              <Button
                onClick={() => {
                  setToken(draftToken.trim())
                  setDraftToken('')
                }}
                variant="secondary"
              >
                Save token
              </Button>
              <Button onClick={clearToken} variant="secondary">
                Clear token
              </Button>
            </div>
            <p className={styles.tokenStatus}>
              {token ? 'Token saved locally.' : 'No token saved.'}
            </p>
          </div>
        </aside>
      </header>

      <section className={styles.content}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Create a list</h2>
              <p>Add a new todo list using the backend REST API.</p>
            </div>
          </div>

          <TodoForm
            isSubmitting={createTodoMutation.isPending}
            onSubmit={async (name) => {
              await createTodoMutation.mutateAsync({ name })
            }}
          />

          {createTodoMutation.error instanceof Error ? (
            <ErrorMessage message={createTodoMutation.error.message} />
          ) : null}
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Existing lists</h2>
              <p>Data is cached and refreshed through React Query.</p>
            </div>
            {todosQuery.isFetching ? <Spinner /> : null}
          </div>

          {todosQuery.isLoading ? (
            <div className={styles.loadingState}>
              <Spinner />
              <span>Loading todo lists...</span>
            </div>
          ) : null}

          {!todosQuery.isLoading && todosQuery.isError ? (
            <ErrorMessage message={errorMessage} />
          ) : null}

          {!todosQuery.isLoading &&
          !todosQuery.isError &&
          todosQuery.data &&
          todosQuery.data.length === 0 ? (
            <EmptyState
              description="Create your first todo list to verify the API connection."
              title="No todo lists yet"
            />
          ) : null}

          {!todosQuery.isLoading &&
          !todosQuery.isError &&
          todosQuery.data &&
          todosQuery.data.length > 0 ? (
            <TodoList
              isDeleting={deleteTodoMutation.isPending}
              isUpdating={updateTodoMutation.isPending}
              onDelete={async (id) => {
                await deleteTodoMutation.mutateAsync(id)
              }}
              onUpdate={async (id, name) => {
                await updateTodoMutation.mutateAsync({ id, payload: { name } })
              }}
              todos={todosQuery.data}
            />
          ) : null}

          {updateTodoMutation.error instanceof Error ? (
            <ErrorMessage message={updateTodoMutation.error.message} />
          ) : null}

          {deleteTodoMutation.error instanceof Error ? (
            <ErrorMessage message={deleteTodoMutation.error.message} />
          ) : null}
        </div>
      </section>
    </section>
  )
}

import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { TodoForm } from './TodoForm'
import type { Todo } from '../types/todo'
import styles from './TodoList.module.css'

type TodoListProps = {
  isDeleting: boolean
  isUpdating: boolean
  onDelete: (id: number) => Promise<void> | void
  onUpdate: (id: number, name: string) => Promise<void> | void
  todos: Todo[]
}

export function TodoList({
  isDeleting,
  isUpdating,
  onDelete,
  onUpdate,
  todos,
}: TodoListProps) {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null)

  return (
    <ul className={styles.list}>
      {todos.map((todo) => {
        const isEditing = editingTodoId === todo.id

        return (
          <li className={styles.card} key={todo.id}>
            {isEditing ? (
              <TodoForm
                ctaLabel="Save"
                initialValue={todo.name}
                isSubmitting={isUpdating}
                onSubmit={async (name) => {
                  await onUpdate(todo.id, name)
                  setEditingTodoId(null)
                }}
              />
            ) : (
              <div className={styles.row}>
                <div>
                  <p className={styles.title}>{todo.name}</p>
                  <p className={styles.meta}>Todo #{todo.id}</p>
                </div>

                <div className={styles.actions}>
                  <Button
                    onClick={() => setEditingTodoId(todo.id)}
                    variant="secondary"
                  >
                    Edit
                  </Button>
                  <Button
                    isLoading={isDeleting}
                    onClick={() => void onDelete(todo.id)}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

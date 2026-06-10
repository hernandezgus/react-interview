import { type KeyboardEvent, useState } from 'react'
import {
  Box,
  Checkbox,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material'
import type { TodoItem, TodoList } from '../features/todolists/types'

type TodoItemListProps = {
  isWorking: boolean
  onDeleteItem: (todoList: TodoList, itemId: number) => Promise<void>
  onToggleCompleted: (
    todoList: TodoList,
    itemId: number,
    completed: boolean,
  ) => Promise<void>
  onUpdateItemName: (
    todoList: TodoList,
    itemId: number,
    name: string,
  ) => Promise<void>
  items: TodoItem[]
  todoList: TodoList
}

export function TodoItemList({
  isWorking,
  items,
  onDeleteItem,
  onToggleCompleted,
  onUpdateItemName,
  todoList,
}: TodoItemListProps) {
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [draftName, setDraftName] = useState('')

  if (items.length === 0) {
    return (
      <Typography color="text.secondary" variant="body2">
        No items in this list yet.
      </Typography>
    )
  }

  return (
    <List disablePadding>
      {items.map((item) => (
        <ListItem className="todo-card__item" disableGutters key={item.id}>
          <Checkbox
            checked={item.completed}
            disabled={isWorking}
            onChange={(event) =>
              void onToggleCompleted(todoList, item.id, event.target.checked)
            }
          />

          {editingItemId === item.id ? (
            <TextField
              autoFocus
              className="todo-card__item-input"
              disabled={isWorking}
              onChange={(event) => setDraftName(event.target.value)}
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Escape') {
                  setEditingItemId(null)
                  setDraftName('')
                }

                if (event.key === 'Enter' && draftName.trim()) {
                  void onUpdateItemName(todoList, item.id, draftName.trim()).then(() => {
                    setEditingItemId(null)
                    setDraftName('')
                  })
                }
              }}
              size="small"
              value={draftName}
            />
          ) : (
            <Typography
              className={item.completed ? 'todo-card__item-name todo-card__item-name--completed' : 'todo-card__item-name'}
              variant="body1"
            >
              {item.name}
            </Typography>
          )}

          <Box className="todo-card__item-actions">
            {editingItemId === item.id ? (
              <IconButton
                disabled={isWorking || !draftName.trim()}
                onClick={() =>
                  void onUpdateItemName(todoList, item.id, draftName.trim()).then(() => {
                    setEditingItemId(null)
                    setDraftName('')
                  })
                }
                size="small"
              >
                Save
              </IconButton>
            ) : (
              <IconButton
                disabled={isWorking}
                onClick={() => {
                  setEditingItemId(item.id)
                  setDraftName(item.name)
                }}
                size="small"
              >
                Edit
              </IconButton>
            )}
            <IconButton
              disabled={isWorking}
              onClick={() => void onDeleteItem(todoList, item.id)}
              size="small"
            >
              Delete
            </IconButton>
          </Box>
        </ListItem>
      ))}
    </List>
  )
}

import { type KeyboardEvent, useState } from 'react'
import {
  Box,
  Checkbox,
  IconButton,
  ListItem,
  TextField,
  Typography,
} from '@mui/material'
import type { TodoItem, TodoList } from '../features/todolists/types'
import { List, type RowComponentProps } from 'react-window'

// This component uses react-window virtualization to render only visible TodoItems
// from very large lists, keeping performance stable even with 100,000+ rows.

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

  const rowHeight = 72
  const height = Math.min(400, items.length * rowHeight)

  const Row = ({ index, style, ariaAttributes }: RowComponentProps) => {
    const item = items[index]

    return (
      <ListItem
        className="todo-card__item"
        disableGutters
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          boxSizing: 'border-box',
        }}
        {...ariaAttributes}
      >
        <Checkbox
          checked={item.completed}
          disabled={isWorking}
          onChange={(event) =>
            void onToggleCompleted(todoList, item.id, event.target.checked)
          }
        />

        <Box sx={{ flex: 1, mr: 1 }}>
          {editingItemId === item.id ? (
            <TextField
              autoFocus
              fullWidth
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
              className={
                item.completed
                  ? 'todo-card__item-name todo-card__item-name--completed'
                  : 'todo-card__item-name'
              }
              variant="body1"
            >
              {item.name}
            </Typography>
          )}
        </Box>

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
    )
  }

  return (
    <List
      className="todo-card__item-list"
      defaultHeight={height}
      rowCount={items.length}
      rowHeight={rowHeight}
      rowComponent={Row}
      rowProps={{}}
      style={{ width: '100%' }}
    />
  )
}

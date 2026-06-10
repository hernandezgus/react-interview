import { type FormEvent, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { TodoItemList } from './TodoItemList'
import type { TodoList } from '../features/todolists/types'

type TodoListCardProps = {
  actionErrorMessage: string
  isWorking: boolean
  onAddItem: (todoList: TodoList, itemName: string) => Promise<void>
  onDeleteItem: (todoList: TodoList, itemId: number) => Promise<void>
  onDeleteList: (todoListId: number) => Promise<void>
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
  onUpdateList: (todoListId: number, name: string) => Promise<void>
  todoList: TodoList
}

export function TodoListCard({
  actionErrorMessage,
  isWorking,
  onAddItem,
  onDeleteItem,
  onDeleteList,
  onToggleCompleted,
  onUpdateItemName,
  onUpdateList,
  todoList,
}: TodoListCardProps) {
  const [isEditingListName, setIsEditingListName] = useState(false)
  const [draftListName, setDraftListName] = useState(todoList.name)
  const [newItemName, setNewItemName] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  async function handleAddItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = newItemName.trim()
    if (!trimmedName) {
      return
    }

    await onAddItem(todoList, trimmedName)
    setNewItemName('')
  }

  return (
    <>
    <Card className="todo-card">
      <CardContent>
        <Stack spacing={2}>
          <Box className="todo-card__header">
            <Box className="todo-card__title-block">
              {isEditingListName ? (
                <Box className="todo-card__list-edit-row">
                  <TextField
                    autoFocus
                    disabled={isWorking}
                    onChange={(event) => setDraftListName(event.target.value)}
                    size="small"
                    value={draftListName}
                  />
                  <Button
                    disabled={isWorking || !draftListName.trim()}
                    onClick={() =>
                      void onUpdateList(todoList.id, draftListName.trim()).then(() => {
                        setIsEditingListName(false)
                      })
                    }
                    size="small"
                    variant="contained"
                  >
                    Save
                  </Button>
                  <Button
                    disabled={isWorking}
                    onClick={() => {
                      setDraftListName(todoList.name)
                      setIsEditingListName(false)
                    }}
                    size="small"
                    variant="text"
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <>
                  <Typography component="h3" variant="h6">
                    {todoList.name}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    List #{todoList.id}
                  </Typography>
                </>
              )}
            </Box>

            <Box className="todo-card__header-actions">
              <Typography color="text.secondary" variant="body2">
                {todoList.items.length} item{todoList.items.length === 1 ? '' : 's'}
              </Typography>
              {!isEditingListName ? (
                <>
                  <IconButton
                    disabled={isWorking}
                    onClick={() => {
                      setDraftListName(todoList.name)
                      setIsEditingListName(true)
                    }}
                    size="small"
                  >
                    Edit
                  </IconButton>
                  <IconButton
                    disabled={isWorking}
                    onClick={() => setIsDeleteDialogOpen(true)}
                    size="small"
                  >
                    Delete
                  </IconButton>
                </>
              ) : null}
            </Box>
          </Box>

          {actionErrorMessage ? <Alert severity="error">{actionErrorMessage}</Alert> : null}

          <Box
            className="todo-card__add-item-form"
            component="form"
            onSubmit={(event) => void handleAddItem(event)}
          >
            <TextField
              className="todo-card__add-item-input"
              disabled={isWorking}
              label="New item"
              onChange={(event) => setNewItemName(event.target.value)}
              size="small"
              value={newItemName}
            />
            <Button
              disabled={isWorking || !newItemName.trim()}
              type="submit"
              variant="outlined"
            >
              Add item
            </Button>
          </Box>

          <Divider />
          <TodoItemList
            isWorking={isWorking}
            items={todoList.items}
            onDeleteItem={onDeleteItem}
            onToggleCompleted={onToggleCompleted}
            onUpdateItemName={onUpdateItemName}
            todoList={todoList}
          />
        </Stack>
      </CardContent>
    </Card>
    <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
      <DialogTitle>Delete todo list?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will remove "{todoList.name}" and all of its items.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
        <Button
          color="error"
          onClick={() =>
            void onDeleteList(todoList.id).then(() => {
              setIsDeleteDialogOpen(false)
            })
          }
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    </>
  )
}

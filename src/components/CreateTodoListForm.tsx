import { type FormEvent, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { CreateTodoListPayload } from '../features/todolists/types'

type CreateTodoListFormProps = {
  errorMessage: string
  isSubmitting: boolean
  onSubmit: (payload: CreateTodoListPayload) => Promise<void>
}

type DraftItem = {
  id: string
  name: string
}

function buildDraftItem(): DraftItem {
  return {
    id: crypto.randomUUID(),
    name: '',
  }
}

export function CreateTodoListForm({
  errorMessage,
  isSubmitting,
  onSubmit,
}: CreateTodoListFormProps) {
  const [name, setName] = useState('')
  const [items, setItems] = useState<DraftItem[]>([buildDraftItem()])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const payload: CreateTodoListPayload = {
      name: name.trim(),
      items: items
        .map((item) => item.name.trim())
        .filter(Boolean)
        .map((itemName) => ({
          name: itemName,
          completed: false,
        })),
    }

    await onSubmit(payload)
    setName('')
    setItems([buildDraftItem()])
  }

  function updateItem(id: string, value: string) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, name: value } : item,
      ),
    )
  }

  function removeItem(id: string) {
    setItems((currentItems) =>
      currentItems.length === 1
        ? currentItems
        : currentItems.filter((item) => item.id !== id),
    )
  }

  return (
    <Card className="todo-form">
      <CardContent>
        <Stack
          className="todo-form__content"
          component="form"
          onSubmit={(event) => void handleSubmit(event)}
          spacing={2.5}
        >
          <Box>
            <Typography component="h2" variant="h5">
              Create todo list
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Add a list and a few starter items in one request.
            </Typography>
          </Box>

          <TextField
            label="List name"
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />

          <Stack spacing={1.5}>
            <Typography className="todo-form__label" variant="subtitle2">
              Items
            </Typography>

            {items.map((item, index) => (
              <Box className="todo-form__item-row" key={item.id}>
                <TextField
                  fullWidth
                  label={`Item ${index + 1}`}
                  onChange={(event) => updateItem(item.id, event.target.value)}
                  value={item.name}
                />
                <IconButton
                  aria-label={`Remove item ${index + 1}`}
                  color="secondary"
                  disabled={items.length === 1}
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </IconButton>
              </Box>
            ))}

            <Button
              className="todo-form__add-button"
              onClick={() => setItems((currentItems) => [...currentItems, buildDraftItem()])}
              type="button"
              variant="outlined"
            >
              Add item
            </Button>
          </Stack>

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <Button disabled={!name.trim() || isSubmitting} type="submit" variant="contained">
            {isSubmitting ? 'Saving...' : 'Save list'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

import { type FormEvent, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import type { CreateTodoListPayload } from '../features/todolists/types'

type CreateTodoListFormProps = {
  errorMessage: string
  isSubmitting: boolean
  onSubmit: (payload: CreateTodoListPayload) => Promise<void>
}

export function CreateTodoListForm({
  errorMessage,
  isSubmitting,
  onSubmit,
}: CreateTodoListFormProps) {
  const [name, setName] = useState('')
  const [currentItem, setCurrentItem] = useState('')
  const [items, setItems] = useState<string[]>([])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const payload: CreateTodoListPayload = {
      name: name.trim(),
      items: items.map((itemName) => ({
        name: itemName,
        completed: false,
      })),
    }

    await onSubmit(payload)
    setName('')
    setCurrentItem('')
    setItems([])
  }

  function addItem() {
    const itemName = currentItem.trim()
    if (itemName === '') {
      return
    }

    setItems((currentItems) => [...currentItems, itemName])
    setCurrentItem('')
  }

  function removeItem(index: number) {
    setItems((currentItems) =>
      currentItems.filter((_, itemIndex) => itemIndex !== index),
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

            <Box className="todo-form__item-row">
              <TextField
                fullWidth
                label="New item"
                onChange={(event) => setCurrentItem(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addItem()
                  }
                }}
                value={currentItem}
              />
              <Button
                className="todo-form__add-button"
                onClick={addItem}
                type="button"
                variant="outlined"
              >
                Add item
              </Button>
            </Box>

            {items.length > 0 ? (
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell align="right">Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={`${item}-${index}`}>
                        <TableCell>{item}</TableCell>
                        <TableCell align="right">
                          <Button
                            color="secondary"
                            onClick={() => removeItem(index)}
                            size="small"
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
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

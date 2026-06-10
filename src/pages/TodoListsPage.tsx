import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import { CreateTodoListForm } from '../components/CreateTodoListForm'
import { TodoListCard } from '../components/TodoListCard'
import { useTodoLists } from '../hooks/useTodoLists'
import { syncTodos } from '../api/todoLists'

type TodoListsPageProps = {
  onLogout: () => void
  token: string | null
}

export function TodoListsPage({ onLogout, token }: TodoListsPageProps) {
  const {
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
  } = useTodoLists()

  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{
    success: boolean
    created: number
    failed: number
    message?: string
  } | null>(null)
  const [syncError, setSyncError] = useState('')

  const handleSync = async () => {
    setIsSyncing(true)
    setSyncError('')
    setSyncResult(null)

    try {
      const result = await syncTodos()
      setSyncResult(result)
      if (result.success) {
        await loadTodoLists()
      }
    } catch (error) {
      setSyncError('Sync failed. Please try again.')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSyncResult(null)
    setSyncError('')
  }

  return (
    <Container className="todo-page" maxWidth="lg">
      <Stack className="todo-page__layout" spacing={3}>
        <Box className="todo-page__hero">
          <div>
            <Typography component="h1" variant="h3">
              Todo Lists
            </Typography>
            <Typography color="text.secondary" variant="body1">
              Connected to the protected NestJS API with a stored JWT token.
            </Typography>
            <Typography className="todo-page__token" variant="caption">
              Token loaded: {token ? 'yes' : 'no'}
            </Typography>
          </div>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Button onClick={handleSync} variant="contained" disabled={isSyncing}>
              {isSyncing ? 'Syncing...' : 'Sync'}
            </Button>
            <Button onClick={onLogout} variant="outlined">
              Logout
            </Button>
          </Stack>
        </Box>

        <Box className="todo-page__content">
          <Box>
            <CreateTodoListForm
              errorMessage={formErrorMessage}
              isSubmitting={isSubmitting}
              onSubmit={submitTodoList}
            />
          </Box>

          <Box>
            <Stack spacing={2}>
              <Box className="todo-page__section-header">
                <Typography component="h2" variant="h5">
                  Existing lists
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Each card includes the nested todo items returned by the backend.
                </Typography>
              </Box>

              {isLoading ? (
                <Box className="todo-page__loading">
                  <CircularProgress />
                </Box>
              ) : null}

              {!isLoading && errorMessage ? (
                <Alert severity="error">{errorMessage}</Alert>
              ) : null}

              {!isLoading && !errorMessage && todoLists.length === 0 ? (
                <Alert severity="info">No todo lists yet. Create one to get started.</Alert>
              ) : null}

              {!isLoading && !errorMessage ? (
                <Stack spacing={2}>
                  {todoLists.map((todoList) => (
                    <TodoListCard
                      actionErrorMessage={
                        activeListId === todoList.id ? actionErrorMessage : ''
                      }
                      isWorking={activeListId === todoList.id}
                      key={todoList.id}
                      onAddItem={addTodoItem}
                      onDeleteItem={removeTodoItem}
                      onDeleteList={removeTodoList}
                      onToggleCompleted={toggleTodoItemCompleted}
                      onUpdateItemName={saveTodoItemName}
                      onUpdateList={(todoListId, name) =>
                        saveTodoList(todoListId, {
                          name,
                          items: todoList.items.map((item) => ({
                            name: item.name,
                            completed: item.completed,
                          })),
                        })
                      }
                      todoList={todoList}
                    />
                  ))}
                </Stack>
              ) : null}
            </Stack>
          </Box>
        </Box>
      </Stack>

      {(syncResult || syncError) && (
        <Snackbar
          open={Boolean(syncResult) || Boolean(syncError)}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          {syncError ? (
            <Alert severity="error" onClose={handleCloseSnackbar}>
              {syncError}
            </Alert>
          ) : (
            <Alert
              severity={syncResult?.success ? 'success' : 'warning'}
              onClose={handleCloseSnackbar}
            >
              Sync completed: {syncResult?.created ?? 0} created, {syncResult?.failed ?? 0} failed
            </Alert>
          )}
        </Snackbar>
      )}
    </Container>
  )
}

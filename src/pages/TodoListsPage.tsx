import { Alert, Box, Button, CircularProgress, Container, Stack, Typography } from '@mui/material'
import { CreateTodoListForm } from '../components/CreateTodoListForm'
import { TodoListCard } from '../components/TodoListCard'
import { useTodoLists } from '../hooks/useTodoLists'

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
    removeTodoItem,
    removeTodoList,
    saveTodoItemName,
    saveTodoList,
    submitTodoList,
    toggleTodoItemCompleted,
    todoLists,
  } = useTodoLists()

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

          <Button onClick={onLogout} variant="outlined">
            Logout
          </Button>
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
    </Container>
  )
}

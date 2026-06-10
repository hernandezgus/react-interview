import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { useAuth } from './hooks/useAuth'
import { LoginPage } from './pages/LoginPage'
import { TodoListsPage } from './pages/TodoListsPage'

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f766e',
    },
    secondary: {
      main: '#f97316',
    },
    background: {
      default: '#f8fafc',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
  },
})

function App() {
  const { clearToken, isAuthenticated, token, updateToken } = useAuth()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthenticated ? (
        <TodoListsPage onLogout={clearToken} token={token} />
      ) : (
        <LoginPage onLogin={updateToken} />
      )}
    </ThemeProvider>
  )
}

export default App

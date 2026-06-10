import { type FormEvent, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { AxiosError } from 'axios'
import { login } from '../api/auth'

type LoginPageProps = {
  onLogin: (token: string) => void
}

function getLoginErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? 'Login failed.'
  }

  return 'Login failed.'
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('password')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const result = await login({ username, password })
      onLogin(result.access_token)
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container className="login-page" maxWidth="sm">
      <Card className="login-page__card">
        <CardContent>
          <Stack
            className="login-page__content"
            component="form"
            onSubmit={(event) => void handleSubmit(event)}
            spacing={3}
          >
            <Box>
              <Typography component="h1" variant="h4">
                Todo API Login
              </Typography>
              <Typography color="text.secondary" variant="body1">
                Sign in to access the protected todo list endpoints.
              </Typography>
            </Box>

            <TextField
              label="Username"
              onChange={(event) => setUsername(event.target.value)}
              required
              value={username}
            />
            <TextField
              label="Password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />

            {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

            <Button disabled={isSubmitting} size="large" type="submit" variant="contained">
              {isSubmitting ? 'Signing in...' : 'Login'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}

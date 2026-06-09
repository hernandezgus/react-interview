import styles from './App.module.css'
import { AppErrorBoundary } from './app/AppErrorBoundary'
import { TodoPage } from './features/todos/pages/TodoPage'

function App() {
  return (
    <AppErrorBoundary>
      <main className={styles.app}>
        <TodoPage />
      </main>
    </AppErrorBoundary>
  )
}

export default App

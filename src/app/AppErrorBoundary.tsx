import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorMessage } from '../components/ui/ErrorMessage'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unexpected render error', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorMessage message="Something unexpected happened while rendering the app." />
      )
    }

    return this.props.children
  }
}

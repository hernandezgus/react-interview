import styles from './ErrorMessage.module.css'

type ErrorMessageProps = {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return <div className={styles.error}>{message}</div>
}

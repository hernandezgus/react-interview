import styles from './EmptyState.module.css'

type EmptyStateProps = {
  description: string
  title: string
}

export function EmptyState({ description, title }: EmptyStateProps) {
  return (
    <section className={styles.emptyState}>
      <h3>{title}</h3>
      <p>{description}</p>
    </section>
  )
}

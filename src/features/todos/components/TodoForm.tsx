import { type FormEvent, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import styles from './TodoForm.module.css'

type TodoFormProps = {
  ctaLabel?: string
  initialValue?: string
  isSubmitting?: boolean
  onSubmit: (value: string) => Promise<void> | void
}

export function TodoForm({
  ctaLabel = 'Add todo',
  initialValue = '',
  isSubmitting = false,
  onSubmit,
}: TodoFormProps) {
  const [name, setName] = useState(initialValue)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) {
      return
    }

    await onSubmit(trimmedName)

    if (!initialValue) {
      setName('')
    }
  }

  return (
    <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
      <Input
        aria-label="Todo name"
        maxLength={80}
        onChange={(event) => setName(event.target.value)}
        placeholder="Plan a launch checklist"
        value={name}
      />
      <Button isLoading={isSubmitting} type="submit">
        {ctaLabel}
      </Button>
    </form>
  )
}

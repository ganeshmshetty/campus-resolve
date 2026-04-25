import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  hint?: string
}

export function TextInput({ className, id, label, hint, ...props }: TextInputProps) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <input className={cn('field__input', className)} id={id} {...props} />
      {hint ? <p className="field__hint">{hint}</p> : null}
    </div>
  )
}

import { AuthForm } from '../auth-form'
import { useState } from 'react'

export default function AuthFormExample() {
  const [mode, setMode] = useState<"login" | "register">("login")

  return (
    <AuthForm
      mode={mode}
      onSubmit={(data) => console.log('Auth submit:', data)}
      onModeChange={setMode}
    />
  )
}
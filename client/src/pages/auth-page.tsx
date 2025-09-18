import { useState } from "react"
import { AuthForm } from "@/components/auth-form"

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [isLoading, setIsLoading] = useState(false)

  const handleAuthSubmit = async (data: { username: string; password: string; role?: string }) => {
    console.log(`${authMode} attempt:`, data)
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      console.log(`${authMode} successful!`)
      // TODO: Handle successful auth - store token, redirect to dashboard
    }, 2000)
  }

  return (
    <AuthForm
      mode={authMode}
      onSubmit={handleAuthSubmit}
      onModeChange={setAuthMode}
      isLoading={isLoading}
    />
  )
}
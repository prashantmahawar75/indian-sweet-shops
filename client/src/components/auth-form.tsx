import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Candy, Eye, EyeOff } from "lucide-react"

interface AuthFormProps {
  mode: "login" | "register"
  onSubmit: (data: { username: string; password: string; role?: string }) => void
  onModeChange: (mode: "login" | "register") => void
  isLoading?: boolean
}

export function AuthForm({ mode, onSubmit, onModeChange, isLoading = false }: AuthFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user"
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`${mode} form submitted`, formData)
    onSubmit(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Candy className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {mode === "login" 
              ? "Sign in to access your sweet shop dashboard" 
              : "Join our sweet shop management system"
            }
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                required
                data-testid="input-username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  data-testid="input-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover-elevate"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger data-testid="select-role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Customer</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !formData.username || !formData.password}
              data-testid={`button-${mode}`}
            >
              {isLoading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>

            <div className="text-center text-sm">
              {mode === "login" ? (
                <span>
                  Don't have an account?{" "}
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-primary hover:text-primary"
                    onClick={() => onModeChange("register")}
                    data-testid="button-switch-to-register"
                  >
                    Sign up
                  </Button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-primary hover:text-primary"
                    onClick={() => onModeChange("login")}
                    data-testid="button-switch-to-login"
                  >
                    Sign in
                  </Button>
                </span>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
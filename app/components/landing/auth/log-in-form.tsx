import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { emailLoginSchema, type EmailLoginForm } from '@/lib/validation/log-in-validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { login } from '@/services/auth.service'
import type { LoginRequest } from '@/services/auth.service'

interface LoginFlowProps {
  loginData: {
    email: string
    password: string
  }
  setLoginData: (data: any) => void
}

export default function LoginForm({ loginData, setLoginData }: LoginFlowProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const emailForm = useForm<EmailLoginForm>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: loginData.email,
      password: loginData.password,
    },
  })

  useEffect(() => {
    emailForm.reset({
      email: loginData.email,
      password: loginData.password,
    })
  }, [loginData, emailForm])
  const onLoginSubmit = async (data: EmailLoginForm) => {
    console.log('Login form submitted with data:', data)
    setIsLoading(true)
    setError(null)

    try {
      const loginRequest: LoginRequest = {
        email: data.email,
        password: data.password,
      }

      console.log('Calling login service with:', loginRequest)

      // Memanggil service login
      const user = await login(loginRequest)
      console.log('Login successful, user:', user)

      // Update state parent
      const finalData = { ...loginData, ...data }
      setLoginData(finalData)

      // Redirect ke dashboard jika berhasil
      console.log('Redirecting to dashboard...')
      navigate('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Login gagal. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="space-y-4 w-100">
      {error && <div className="p-3 rounded bg-red-50 text-red-600 text-sm">{error}</div>}

      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onLoginSubmit)} className="space-y-4">
          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" className="w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={emailForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
                <FormMessage />
              </FormItem>
            )}
          />{' '}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            onClick={() => console.log('Login button clicked!')}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
      </Form>

      <p className="text-center caption">Or login with</p>

      <div className="space-y-4">
        <div className="space-y-6">
          <Button size="lg" className="w-full" variant="outline">
            <Mail className="size-4" />
            Sign up with Email
          </Button>
        </div>

        <span className="paragraph-small">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="font-medium text-primary">
            Join PaperNest
          </Link>
        </span>
      </div>
    </div>
  )
}

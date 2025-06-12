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
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { Link } from 'react-router'

interface LoginFlowProps {
  loginData: {
    email: string
    password: string
    confirmPassword: string
  }
  setLoginData: (data: any) => void
}

export default function LoginForm({ loginData, setLoginData }: LoginFlowProps) {
  const emailForm = useForm<EmailLoginForm>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: loginData.email,
      password: loginData.password,
      confirmPassword: loginData.confirmPassword,
    },
  })

  useEffect(() => {
    emailForm.reset({
      email: loginData.email,
      password: loginData.password,
      confirmPassword: loginData.confirmPassword,
    })
  }, [loginData])

  const onLoginSubmit = (data: EmailLoginForm) => {
    const finalData = { ...loginData, ...data }
    setLoginData(finalData)
    console.log('Signup completed!', finalData)
  }

  return (
    <div className="space-y-4 w-100">
      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onLoginSubmit)} className="space-y-4">
          <Form {...emailForm}>
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
          </Form>

          <Form {...emailForm}>
            <FormField
              control={emailForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Create a password" {...field} />
                  </FormControl>
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>

          <Form {...emailForm}>
            <FormField
              control={emailForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>

          <Button type="submit" className="w-full">
            Log in
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

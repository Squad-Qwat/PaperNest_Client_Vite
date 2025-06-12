'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Mail, Chrome, ArrowLeft, ArrowRight, Check, User, Building2 } from 'lucide-react'
import {
  emailSignupSchema,
  profileSchema,
  workspaceSchema,
  type EmailSignupForm,
  type ProfileForm,
  type WorkspaceForm,
} from '@/lib/validation/sign-up-validation'
import { Link } from 'react-router'

interface SignUpFlowProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  signupData: {
    method: string
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
    username: string
    workspaceIcon: string
    workspaceName: string
    workspaceDescription: string
  }
  setSignupData: (data: any) => void
}

export function SignupForm({
  currentStep,
  setCurrentStep,
  signupData,
  setSignupData,
}: SignUpFlowProps) {
  const [emailSubStep, setEmailSubStep] = useState(0)

  const emailForm = useForm<EmailSignupForm>({
    resolver: zodResolver(emailSignupSchema),
    defaultValues: {
      method: signupData.method,
      email: signupData.email,
      password: signupData.password,
      confirmPassword: signupData.confirmPassword,
    },
  })

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      username: signupData.username,
    },
  })

  const workspaceForm = useForm<WorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      workspaceIcon: signupData.workspaceIcon,
      workspaceName: signupData.workspaceName,
      workspaceDescription: signupData.workspaceDescription,
    },
  })

  useEffect(() => {
    emailForm.reset({
      method: signupData.method,
      email: signupData.email,
      password: signupData.password,
      confirmPassword: signupData.confirmPassword,
    })
    profileForm.reset({
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      username: signupData.username,
    })
    workspaceForm.reset({
      workspaceIcon: signupData.workspaceIcon,
      workspaceName: signupData.workspaceName,
      workspaceDescription: signupData.workspaceDescription,
    })
  }, [signupData])

  useEffect(() => {
    if (currentStep === 0) {
      if (!signupData.method) setEmailSubStep(0)
      else if (!signupData.email) setEmailSubStep(1)
      else if (!signupData.password) setEmailSubStep(2)
      else if (!signupData.confirmPassword) setEmailSubStep(3)
      else setEmailSubStep(4)
    }
  }, [currentStep])

  const handleMethodSelect = (method: string) => {
    const newData = { ...signupData, method }
    setSignupData(newData)
    emailForm.setValue('method', method)

    if (method === 'google') {
      setCurrentStep(1)
    } else {
      setEmailSubStep(1)
    }
  }

  const handleEmailNext = () => {
    if (emailSubStep === 1) {
      emailForm.trigger('email').then((isValid) => {
        if (isValid) {
          setSignupData({ ...signupData, email: emailForm.getValues('email') })
          setEmailSubStep(2)
        }
      })
    } else if (emailSubStep === 2) {
      emailForm.trigger('password').then((isValid) => {
        if (isValid) {
          setSignupData({ ...signupData, password: emailForm.getValues('password') })
          setEmailSubStep(3)
        }
      })
    } else if (emailSubStep === 3) {
      emailForm.trigger(['password', 'confirmPassword']).then((isValid) => {
        if (isValid) {
          const values = emailForm.getValues()
          setSignupData({ ...signupData, ...values })
          setCurrentStep(1)
        }
      })
    }
  }

  const handleEmailBack = () => {
    if (emailSubStep > 0) {
      setEmailSubStep(emailSubStep - 1)
    }
  }

  const onProfileSubmit = (data: ProfileForm) => {
    setSignupData({ ...signupData, ...data })
    setCurrentStep(2)
  }

  const onWorkspaceSubmit = (data: WorkspaceForm) => {
    const finalData = { ...signupData, ...data }
    setSignupData(finalData)
    console.log('Signup completed!', finalData)
  }

  const handleBack = () => {
    if (currentStep === 1) {
      setCurrentStep(0)
      setEmailSubStep(4)
    } else if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  const workspaceIcons = ['🚀', '💼', '🏢', '⚡', '🎯', '🔥', '💡', '🌟', '🎨', '🔧']

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        if (emailSubStep === 0) {
          return (
            <div className="space-y-6">
              <div className="space-y-6">
                <Button size="lg" className="w-full" onClick={() => handleMethodSelect('email')}>
                  <Mail className="size-4" />
                  Sign up with Email
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => handleMethodSelect('google')}
                >
                  <Chrome className="size-4" />
                  Continue with Google
                </Button>
              </div>

              <span className="paragraph-small">
                Have an account?{' '}
                <Link to="/signin" className="font-medium text-primary">
                  Sign in
                </Link>
              </span>
            </div>
          )
        }

        if (emailSubStep === 1) {
          return (
            <div className="space-y-4 w-100">
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

              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:gap-3">
                <Button variant="outline" onClick={handleEmailBack} className="w-1/2">
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button onClick={handleEmailNext} className="w-1/2">
                  Next
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )
        }

        if (emailSubStep === 2) {
          return (
            <div className="space-y-4 w-100">
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

              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:gap-3">
                <Button variant="outline" onClick={handleEmailBack} className="w-1/2">
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button onClick={handleEmailNext} className="w-1/2">
                  Next
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )
        }

        if (emailSubStep === 3) {
          return (
            <div className="space-y-4 w-100">
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
                          className="h-11 sm:h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:gap-3">
                <Button variant="outline" onClick={handleEmailBack} className="w-1/2">
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button onClick={handleEmailNext} className="w-1/2">
                  Next
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )
        }
        break

      case 1:
        return (
          <div className="w-100">
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" className="h-11 sm:h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" className="h-11 sm:h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={profileForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" className="h-11 sm:h-12" {...field} />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        At least 3 characters, letters, numbers, and underscores only
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:gap-3">
                  <Button type="button" variant="outline" onClick={handleBack} className="w-1/2">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button type="submit" className="w-1/2">
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )

      case 2:
        return (
          <div className="w-100">
            <Form {...workspaceForm}>
              <form onSubmit={workspaceForm.handleSubmit(onWorkspaceSubmit)} className="space-y-6">
                <FormField
                  control={workspaceForm.control}
                  name="workspaceIcon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Icon</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {workspaceIcons.map((icon) => (
                            <button
                              key={icon}
                              type="button"
                              onClick={() => field.onChange(icon)}
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 flex items-center justify-center text-lg sm:text-xl transition-colors ${
                                field.value === icon
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={workspaceForm.control}
                  name="workspaceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome Workspace" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={workspaceForm.control}
                  name="workspaceDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what this workspace is for..."
                          className="min-h-[80px] w-full resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:gap-3">
                  <Button type="button" variant="outline" onClick={handleBack} className="w-1/2">
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                  <Button type="submit" className="w-1/2">
                    Complete Setup
                    <Check className="size-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )

      default:
        return null
    }
  }

  return <div className="flex justify-center items-center p-4">{renderStep()}</div>
}

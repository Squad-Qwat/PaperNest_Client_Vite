'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SimpleInput } from '@/components/ui/simple-input'
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
import { Link, useNavigate } from 'react-router'
import { register } from '@/services/auth.service'
import type { RegisterRequest } from '@/services/auth.service'
import WorkspacesService from '@/services/workspaces.service'
import UserWorkspaceService from '@/services/user-workspace.service'
import type { CreateWorkspaceForm } from '@/services/workspaces.service'

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
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSubStep, setEmailSubStep] = useState(0)
  const [isJoiningWorkspace, setIsJoiningWorkspace] = useState(false)
  const [workspaceIdToJoin, setWorkspaceIdToJoin] = useState('')

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

  // Tambahkan state terpisah untuk mengatasi masalah input
  const [manualWorkspaceName, setManualWorkspaceName] = useState(signupData.workspaceName || '')
  const [manualWorkspaceDescription, setManualWorkspaceDescription] = useState(
    signupData.workspaceDescription || ''
  )
  const [selectedRole, setSelectedRole] = useState<'Student' | 'Lecturer'>('Student')

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

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Your Role</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 appearance-none border border-gray-300 rounded-md bg-white"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as 'Student' | 'Lecturer')}
                  >
                    <option value="Student">Student</option>
                    <option value="Lecturer">Lecturer</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

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
            <div className="space-y-6">
              {/* Tampilkan opsi berbeda berdasarkan role */}
              {selectedRole === 'Student' ? (
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                      <button
                        type="button"
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                          !isJoiningWorkspace
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsJoiningWorkspace(false)}
                      >
                        <Building2 className="w-4 h-4 mr-2 inline" />
                        Create Workspace
                      </button>
                      <button
                        type="button"
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                          isJoiningWorkspace
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsJoiningWorkspace(true)}
                      >
                        <User className="w-4 h-4 mr-2 inline" />
                        Join Workspace
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-blue-800 text-sm">
                    As a Lecturer, you can join existing workspaces created by students.
                  </p>
                </div>
              )}

              {/* Tampilkan form yang sesuai berdasarkan pilihan */}
              {selectedRole === 'Student' && !isJoiningWorkspace ? (
                // Form Create Workspace untuk Student
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Workspace Icon</label>
                    <div className="flex flex-wrap gap-2">
                      {workspaceIcons.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => {
                            workspaceForm.setValue('workspaceIcon', icon)
                            setSignupData({ ...signupData, workspaceIcon: icon })
                          }}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 flex items-center justify-center text-lg sm:text-xl transition-colors ${
                            (workspaceForm.getValues('workspaceIcon') ||
                              signupData.workspaceIcon) === icon
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Workspace Name</label>
                    <input
                      type="text"
                      placeholder="My Awesome Workspace"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={manualWorkspaceName}
                      onChange={(e) => setManualWorkspaceName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Workspace Description</label>
                    <textarea
                      placeholder="Describe what this workspace is for..."
                      className="min-h-[80px] w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                      value={manualWorkspaceDescription}
                      onChange={(e) => setManualWorkspaceDescription(e.target.value)}
                    ></textarea>
                  </div>
                </>
              ) : (
                // Form Join Workspace untuk Student dan Lecturer
                <div>
                  <label className="block text-sm font-medium mb-1">Workspace ID</label>
                  <input
                    type="text"
                    placeholder="Enter the workspace ID to join"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={workspaceIdToJoin}
                    onChange={(e) => setWorkspaceIdToJoin(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Ask the workspace owner for the ID</p>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:gap-3">
                <Button type="button" variant="outline" onClick={handleBack} className="w-1/2">
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  className="w-1/2"
                  disabled={
                    isLoading ||
                    (isJoiningWorkspace && !workspaceIdToJoin) ||
                    (selectedRole === 'Lecturer' && !workspaceIdToJoin)
                  }
                  onClick={async () => {
                    try {
                      setIsLoading(true)
                      setError(null)

                      // Kumpulkan data manual
                      const finalData = {
                        ...signupData,
                        workspaceName: manualWorkspaceName,
                        workspaceDescription: manualWorkspaceDescription,
                        workspaceIcon:
                          workspaceForm.getValues('workspaceIcon') || signupData.workspaceIcon,
                      }

                      setSignupData(finalData)

                      // Membuat payload untuk registrasi sesuai format API
                      const registerPayload = {
                        name: `${finalData.firstName} ${finalData.lastName}`.trim(),
                        email: finalData.email.trim(),
                        username: finalData.username.trim(),
                        password: finalData.password,
                        role: selectedRole,
                      }

                      console.log('Attempting to register with payload:', registerPayload)

                      // Memanggil service register
                      const user = await register(registerPayload)
                      console.log('Register successful, user:', user)

                      // Menentukan apakah membuat workspace baru atau join workspace
                      if (user.id && user.id !== 'temp-id') {
                        if (selectedRole === 'Student' && !isJoiningWorkspace) {
                          // Student yang membuat workspace baru
                          console.log('Creating workspace for user:', user.id)
                          const workspaceData = {
                            title: manualWorkspaceName.trim(),
                            description: manualWorkspaceDescription.trim(),
                            ownerId: user.id,
                          }

                          let newWorkspace

                          try {
                            // Step 1: Coba buat workspace dengan format dokumentasi API
                            console.log('Trying to create workspace with standard format...')
                            newWorkspace = await WorkspacesService.createWorkspace(workspaceData)
                            console.log(
                              'Workspace created successfully with standard format:',
                              newWorkspace
                            )
                          } catch (standardError) {
                            console.warn(
                              'Standard format failed, trying simple format:',
                              standardError
                            )

                            try {
                              // Step 1b: Fallback ke format sederhana jika gagal
                              newWorkspace =
                                await WorkspacesService.createWorkspaceSimple(workspaceData)
                              console.log(
                                'Workspace created successfully with simple format:',
                                newWorkspace
                              )
                            } catch (simpleError) {
                              console.error('Both workspace creation methods failed:', simpleError)
                              throw new Error(
                                'Gagal membuat workspace. Silakan coba lagi atau hubungi administrator.'
                              )
                            }
                          }

                          // Step 2: Buat relasi UserWorkspace dengan role Owner (hanya jika workspace berhasil dibuat)
                          if (newWorkspace && newWorkspace.id) {
                            try {
                              console.log('Creating UserWorkspace relation with Owner role...')
                              const userWorkspaceRelation =
                                await UserWorkspaceService.createOwnerRelation(
                                  user.id,
                                  newWorkspace.id
                                )
                              console.log(
                                'UserWorkspace relation created successfully:',
                                userWorkspaceRelation
                              )
                            } catch (relationError) {
                              console.warn('UserWorkspace relation creation failed:', relationError)
                              // Continue anyway karena workspace sudah dibuat
                              console.log(
                                'Continuing without UserWorkspace relation - can be created later'
                              )
                            }
                          } else {
                            console.warn(
                              'Workspace ID not available, skipping UserWorkspace relation creation'
                            )
                          }
                        } else {
                          // Student atau Lecturer yang join workspace
                          if (!workspaceIdToJoin) {
                            throw new Error('Workspace ID is required to join a workspace')
                          }

                          console.log(
                            `Joining workspace with ID: ${workspaceIdToJoin} as ${selectedRole}`
                          )

                          try {
                            // Join workspace dengan role yang sesuai
                            const joinMethod =
                              selectedRole === 'Student'
                                ? UserWorkspaceService.joinAsStudent
                                : UserWorkspaceService.joinAsLecturer

                            const joinResult = await joinMethod(user.id, workspaceIdToJoin)
                            console.log(
                              `Successfully joined workspace as ${selectedRole}:`,
                              joinResult
                            )
                          } catch (joinError) {
                            console.error('Failed to join workspace:', joinError)
                            throw new Error(
                              `Gagal bergabung dengan workspace. Pastikan ID workspace benar.`
                            )
                          }
                        }
                      } else {
                        console.log(
                          'Skipping workspace creation/join due to missing or temporary user ID'
                        )
                      }

                      // Redirect ke dashboard
                      console.log('Redirecting to dashboard')
                      navigate('/dashboard')
                    } catch (err) {
                      console.error('Sign-up error:', err)
                      setError(
                        err instanceof Error ? err.message : 'Registrasi gagal. Silakan coba lagi.'
                      )
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                >
                  {isLoading ? 'Processing...' : 'Complete Setup'}
                  <Check className="size-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm">{error}</div>}
      {renderStep()}
    </div>
  )
}

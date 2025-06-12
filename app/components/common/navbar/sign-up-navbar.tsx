import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown, Check, Lock, HelpCircle } from 'lucide-react'
import { Link } from 'react-router'
import { signUpSteps } from '@/data/sign-up-steps'

interface NavbarProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  signupData: {
    method: string
    email: string
    password: string
    confirmPassword: string
  }
}

export function SignupNavbar({ currentStep, setCurrentStep, signupData }: NavbarProps) {
  const steps = signUpSteps

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const getStepStatus = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return signupData.method ? 'completed' : currentStep === 0 ? 'current' : 'accessible'
      case 1:
        if (!signupData.method) return 'locked'
        return signupData.email && validateEmail(signupData.email)
          ? 'completed'
          : currentStep === 1
            ? 'current'
            : 'accessible'
      case 2:
        if (!signupData.method || !signupData.email || !validateEmail(signupData.email))
          return 'locked'
        return signupData.password && validatePassword(signupData.password)
          ? 'completed'
          : currentStep === 2
            ? 'current'
            : 'accessible'
      case 3:
        if (
          !signupData.method ||
          !signupData.email ||
          !validateEmail(signupData.email) ||
          !signupData.password ||
          !validatePassword(signupData.password)
        )
          return 'locked'
        return signupData.confirmPassword && signupData.password === signupData.confirmPassword
          ? 'completed'
          : currentStep === 3
            ? 'current'
            : 'accessible'
      case 4:
        if (
          !signupData.method ||
          !signupData.email ||
          !validateEmail(signupData.email) ||
          !signupData.password ||
          !validatePassword(signupData.password) ||
          !signupData.confirmPassword ||
          signupData.password !== signupData.confirmPassword
        )
          return 'locked'
        return currentStep === 4 ? 'completed' : 'accessible'
      default:
        return 'locked'
    }
  }

  const canAccessStep = (stepIndex: number) => {
    const status = getStepStatus(stepIndex)
    return status !== 'locked'
  }

  const handleStepSelect = (stepIndex: number) => {
    if (canAccessStep(stepIndex)) {
      setCurrentStep(stepIndex)
    }
  }

  const getAccessibleStepsCount = () => {
    return steps.filter((_, index) => canAccessStep(index)).length
  }

  return (
    <nav className="border-b">
      <div className="container px-4 py-3 mx-auto sm:py-4">
        <div className="flex flex-wrap gap-y-4 gap-x-8 justify-between items-center">
          <Link to="" className="text-2xl font-black uppercase">
            PaperNest
          </Link>

          <div className="block md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs sm:h-9 sm:text-sm">
                  Navigate
                  <ChevronDown className="ml-1 w-3 h-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56">
                {steps.map((step, index) => {
                  const status = getStepStatus(index)
                  const isAccessible = canAccessStep(index)

                  return (
                    <DropdownMenuItem
                      key={step}
                      onClick={() => handleStepSelect(index)}
                      disabled={!isAccessible}
                      className={`flex items-center justify-between cursor-pointer ${
                        index === currentStep ? 'bg-blue-50 text-blue-700' : ''
                      } ${!isAccessible ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="flex gap-2 items-center text-xs sm:text-sm">
                        {!isAccessible && <Lock className="w-3 h-3" />}
                        {index + 1}. {step}
                      </span>
                      {status === 'completed' && (
                        <Check className="w-3 h-3 text-green-600 sm:h-4 sm:w-4" />
                      )}
                      {status === 'current' && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                    </DropdownMenuItem>
                  )
                })}
                <div className="px-2 py-1 mt-1 text-xs text-gray-500 border-t">
                  {getAccessibleStepsCount()} of {steps.length} steps accessible
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <span className="font-medium paragraph-small text-muted-foreground">
            Step {currentStep + 1} of {steps.length} - {steps[currentStep]}
          </span>

          <div className="hidden items-center space-x-4 md:flex">
            <Link to="/help">
              <Button variant="outline">
                <HelpCircle />
                Help
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button>Log in</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

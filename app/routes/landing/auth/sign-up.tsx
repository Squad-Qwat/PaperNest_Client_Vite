import { SignupForm } from '@/components/landing/auth/sign-up-form'
import { SignupNavbar } from '@/components/common/navbar/sign-up-navbar'
import { useState } from 'react'
import { signUpSteps } from '@/data/sign-up-steps'

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(0)
  const [signupData, setSignupData] = useState({
    method: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    username: '',
    workspaceIcon: '🚀',
    workspaceName: '',
    workspaceDescription: '',
  })

  return (
    <>
      <SignupNavbar
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        signupData={signupData}
      />
      <main>
        <section className="flex flex-col justify-center items-center mt-20 gap-18">
          <h1 className="heading-1">{signUpSteps[currentStep]}</h1>

          <SignupForm
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            signupData={signupData}
            setSignupData={setSignupData}
          />

          <span className="fixed right-0 bottom-0 left-0 mx-auto mb-6 max-w-xs font-normal tracking-normal caption">
            By continuing, you agree to PaperNest’s Terms of Service and Privacy Policy
          </span>
        </section>
      </main>
    </>
  )
}

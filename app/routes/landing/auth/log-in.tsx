import LoginNavbar from '@/components/common/navbar/log-in-navbar'
import LoginForm from '@/components/landing/auth/log-in-form'
import { useState } from 'react'

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  return (
    <>
      <LoginNavbar />
      <main>
        <section className="flex flex-col gap-14 justify-center items-center mt-16">
          <h1 className="heading-1">Sign in into your account</h1>
          <LoginForm loginData={loginData} setLoginData={setLoginData} />
          <span className="fixed right-0 bottom-0 left-0 mx-auto mb-6 max-w-xs font-normal tracking-normal text-center caption">
            By continuing, you agree to PaperNest’s Terms of Service and Privacy Policy
          </span>
        </section>
      </main>
    </>
  )
}

import { LoginForm } from '@/components/user-login-page'
import React from 'react'

function UserLoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
  )
}

export default UserLoginPage

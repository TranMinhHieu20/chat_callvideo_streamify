import React, { useState } from 'react'
import { ShipWheelIcon, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../lib/api'

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const queryClient = useQueryClient()
  const {
    mutate: loginMutation,
    isPending,
    error
  } = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries(['authUser'])
  })

  const handlelogin = (e) => {
    e.preventDefault()

    loginMutation(loginData)
  }
  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* SIDE LEFT */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Streamify
            </span>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response?.data?.message}</span>
            </div>
          )}

          {/* login FORM */}
          <div className="w-full">
            <form onSubmit={handlelogin} className="space-y-3">
              <div>
                <h2 className="text-xl font-semibold">WELCOME BACK</h2>
                <p className="text-sm opacity-70">Join Streamify and start your language learning adventure!</p>
              </div>

              {/* email */}
              <div>
                <label className="label">Email</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter Your Email"
                  value={loginData.email}
                  onChange={(e) => {
                    setLoginData({ ...loginData, email: e.target.value })
                  }}
                  required
                />
              </div>
              {/* password */}
              <div className="relative">
                <label className="label">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input input-bordered w-full pr-14"
                  placeholder="Enter Your PassWord"
                  value={loginData.password}
                  onChange={(e) => {
                    setLoginData({ ...loginData, password: e.target.value })
                  }}
                  required
                />

                {/* hien khi password length >0 */}
                {loginData.password.length > 0 &&
                  (showPassword ? (
                    <Eye
                      className={`absolute top-1/2 right-5 cursor-pointer size-5 ${showPassword ? '' : 'hidden'} `}
                      onClick={() => {
                        setShowPassword(!showPassword)
                      }}
                    />
                  ) : (
                    <EyeOff
                      className={`absolute top-1/2 right-5 cursor-pointer size-5 ${showPassword ? 'hidden' : ''}`}
                      onClick={() => {
                        setShowPassword(!showPassword)
                      }}
                    />
                  ))}
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input type="checkbox" className="checkbox checkbox-sm" required />
                  <span className="text-xs leading-tight">
                    I agree to the <span className="text-primary hover:underline">terms of service</span> and{' '}
                    <span className="text-primary hover:underline">privacy policy</span>
                  </span>
                </label>
              </div>
              <button className="btn btn-primary w-full " type="submit">
                {isPending ? 'Logging...' : 'Login'}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* SIDE RIGHT */}

        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

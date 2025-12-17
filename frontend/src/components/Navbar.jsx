import { Link, Navigate, useLocation } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout } from '../lib/api.js'
import { Bell, LogOut, ShipWheelIcon } from 'lucide-react'
import { toast } from 'sonner'
import ThemeSelector from './ThemeSelector.jsx'

const Navbar = () => {
  const { authUser } = useAuthUser()
  const location = useLocation()
  const isChatPage = location.pathname.startsWith('/chat')

  const queryClient = useQueryClient()

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries(['authUser'])
      toast.success('Logout successful!')
      Navigate('/login')
    },
    onError: () => {
      toast.error('Logout failed. Please try again.')
    }
  })

  const handleLogout = () => {
    logoutMutation()
  }
  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to={'/'} className="flex items-center gap-2.5">
                <ShipWheelIcon className="text-primary size-9" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>
          )}
          <div className="flex items-center gap-4 sm:gap-4">
            <Link to="/notifications" className={`btn btn-circle btn-ghost`}>
              <Bell className="text-base-content opacity-70 size-5 " />
            </Link>
          </div>
          <ThemeSelector />
        </div>
      </div>
    </nav>
  )
}

export default Navbar

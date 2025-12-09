import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import OnBoardingPage from './pages/OnBoardingPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import NotificationsPage from './pages/NotificationsPage'
import { useQuery } from '@tanstack/react-query'
import NotFoundPage from './pages/NotFoundPage'
import axiosInstance from './lib/axios.js'

function App() {
  // tanstack query

  const {
    data: authData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me')
      return res.data
    },
    retry: false
  })
  const authUser = authData?.user
  console.log(authUser)
  return (
    <div>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to={'/login'} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/onboarding" element={authUser ? <OnBoardingPage /> : <Navigate to={'/login'} />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to={'/login'} />} />
        <Route path="/call" element={authUser ? <CallPage /> : <Navigate to={'/login'} />} />
        <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to={'/login'} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App

import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import OnBoardingPage from './pages/OnBoardingPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import NotificationsPage from './pages/NotificationsPage'
import NotFoundPage from './pages/NotFoundPage'
import PageLoader from './components/PageLoader.jsx'
import useAuthUser from './hooks/useAuthUser.js'
import Layout from './components/Layout.jsx'

function App() {
  const { isLoading, authUser } = useAuthUser()

  const isAuthenticated = Boolean(authUser)
  const isOnBoarded = authUser?.isOnBoarded

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="h-screen" data-theme="dark">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
            )
          }
        />
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? !isOnBoarded ? <OnBoardingPage /> : <Navigate to={'/'} /> : <Navigate to={'/login'} />
          }
        />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to={'/login'} />} />
        <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to={'/login'} />} />
        <Route
          path="/notifications"
          element={
            isAuthenticated ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={'/login'} />
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App

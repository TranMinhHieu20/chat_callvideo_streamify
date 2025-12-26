import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser'
import { getTokenStream } from '../lib/api'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import ChatLoader from '../components/PageLoader'

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks
} from '@stream-io/video-react-sdk'
import '@stream-io/video-react-sdk/dist/css/styles.css'

const CallPage = () => {
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY
  const { id: callWithId } = useParams()

  const [client, setClient] = useState(null)
  const [call, setCall] = useState(null)

  const [isConnecting, setIsConnecting] = useState(true)

  const { authUser, isLoading } = useAuthUser()

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getTokenStream,
    enabled: !!authUser
  })
  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callWithId) return

      try {
        console.log('Initializing Stream VideoCall Client ...')

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData?.token
        })

        const callInstance = videoClient.call('default', callWithId)
        await callInstance.join({ create: true })

        console.log('Joined call successfully')

        setClient(videoClient)
        setCall(callInstance)
      } catch (error) {
        console.log('Error Initializing Stream VideoCall CLient: ', error)
        toast.error('Error Initializing Stream VideoCall CLient')
      } finally {
        setIsConnecting(false)
      }
    }
    initCall()

    //eslint-disable-next-line
  }, [authUser, tokenData?.token])

  if (isLoading || isConnecting) return <ChatLoader />
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CallPage

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks()
  const callingState = useCallCallingState()

  const navigate = useNavigate()

  if (callingState === CallingState.LEFT) return navigate('/')

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  )
}

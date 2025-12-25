import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser'
import { useQuery } from '@tanstack/react-query'
import { getTokenStream } from '../lib/api'

import { Channel, ChannelHeader, Chat, MessageInput, MessageList, Thread, Window } from 'stream-chat-react'
import { StreamChat } from 'stream-chat'
import { toast } from 'sonner'
import ChatLoader from '../components/PageLoader'
import CallButton from '../components/CallButton'

const ChatPage = () => {
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY
  const { id: targetUserId } = useParams()

  const [chatClient, setChatClient] = useState(null)
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)

  const { authUser } = useAuthUser()

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getTokenStream,
    enabled: !!authUser
  })

  console.log(tokenData?.token)

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return
      try {
        console.log('Initializing stream chat client ...')
        const client = StreamChat.getInstance(STREAM_API_KEY)

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic
          },
          tokenData?.token
        )

        // create channel chat
        const channelId = [authUser._id, targetUserId].sort().join('-')

        // you and me
        // if i start the chat => channelId: [myId, yourId]
        // if you start the chat => channelId: [yourId, myId]

        const currChannel = client.channel('messaging', channelId, {
          members: [authUser._id, targetUserId]
        })

        await currChannel.watch()

        setChatClient(client)
        setChannel(currChannel)
      } catch (error) {
        console.log('Error initializing chat: ', error)
        toast.error('Could not connect to chat. Please try again')
      } finally {
        setLoading(false)
      }
    }
    initChat()
    // eslint-disable-next-line
  }, [tokenData, authUser, targetUserId])

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`
      })

      toast.success('Video call link sent successfully!')
    }
  }

  if (loading || !channel || !chatClient) return <ChatLoader />

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage

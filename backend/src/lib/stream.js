import { StreamChat } from 'stream-chat'
import 'dotenv/config'

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if (!apiKey || !apiSecret) {
  throw new Error('Stream API key and secret must be set in environment variables')
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret)

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData])
    return userData
  } catch (error) {
    console.error('Error creating Stream user:', error)
    throw error
  }
}

export const generateStreamToken = (userId) => {
  try {
    const userIdToString = userId.toString()
    return streamClient.createToken(userIdToString)
  } catch (error) {
    console.log('Error generateStreamToken in Lib', error)
  }
}

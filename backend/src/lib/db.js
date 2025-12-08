import mongoose from 'mongoose'
import 'dotenv/config'

export const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI
    if (!MONGO_URI) throw new Error('MONGO_URI not is set')
    const conn = await mongoose.connect(MONGO_URI)
    console.log('Connect DB successfully!', conn.connection.host)
  } catch (error) {
    console.log('Connect DB failed!', error)
    process.exit(1)
  }
}

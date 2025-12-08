import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protectAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.jwtHieu
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Not authorized, invalid token' })
    }

    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' })
    }

    req.user = user

    next()
  } catch (error) {
    console.log('Error protectAuth in Middleware', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

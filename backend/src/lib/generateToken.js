import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not is configured!')

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
  res.cookie('jwtHieu', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //ms
    httpOnly: true, // prevent XSS attacks
    sameSite: 'strict', // CSRF attacks
    secure: process.env.NODE_ENV == 'development' ? false : true // HTTPS only in production
  })
}

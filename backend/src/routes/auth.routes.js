import express from 'express'
import { signup, login, logout, getAllUsers, onboard } from '../controllers/auth.controller.js'
import { protectAuthenticated } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/onboarding', protectAuthenticated, onboard)

router.get('/getAllUsers', getAllUsers)
router.get('/check', protectAuthenticated, (req, res) => {
  res.status(200).json(req.user)
})

export default router

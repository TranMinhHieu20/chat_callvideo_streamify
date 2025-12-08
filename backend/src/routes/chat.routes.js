import express from 'express'
import { protectAuthenticated } from '../middleware/auth.middleware.js'
import { getStreamToken } from '../controllers/chat.controller.js'

const router = express.Router()

router.get('/token', protectAuthenticated, getStreamToken)

export default router

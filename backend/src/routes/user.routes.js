import express from 'express'
import {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendRequests
} from '../controllers/user.controller.js'
import { protectAuthenticated } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(protectAuthenticated)

router.get('/', getRecommendedUsers)
router.get('/friends', getMyFriends)

router.post('/friend-request/:idx', sendFriendRequest)
router.put('/friend-request/:idx/accept', acceptFriendRequest)

router.get('/friend-requests', getFriendRequests)
router.get('/outgoing-friend-requests', getOutgoingFriendRequests)

export default router

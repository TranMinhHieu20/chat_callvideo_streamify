import User from '../models/User.js'
import FriendRequest from '../models/FriendRequest.js'

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id
    const currentUser = req.user

    const recommendedUsers = await User.find({
      $and: [{ _id: { $ne: currentUserId } }, { _id: { $nin: currentUser.friends } }, { isOnBoarded: true }]
    }).select('-password')

    res.status(200).json({
      success: true,
      users: recommendedUsers
    })
  } catch (error) {
    console.log('Error getRecommendedUsers in controller', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select('friends')
      .populate('friends', 'fullName profilePic nativeLanguage learningLanguage')
    res.status(200).json(user.friends)
  } catch (error) {
    console.log('Error getMyFriends in controller', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id
    const { idx: recipientId } = req.params
    // prevent sending request to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself' })
    }

    const recipient = await User.findById(recipientId)
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient user not found' })
    }
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: 'Friend request already friends with the user' })
    }
    const exitingRequest = await FriendRequest.findOne({
      $or: [
        // $or → lấy các bản ghi mà (sender = tôi và receiver = người kia) hoặc ngược lại.
        {
          senderId: myId,
          receiverId: recipientId
        },
        {
          senderId: recipientId,
          receiverId: myId
        }
      ]
    })
    if (exitingRequest) {
      return res.status(400).json({ message: 'Friend request already sent or received' })
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId
    })

    res.status(201).json({
      success: true,
      friendRequest
    })
  } catch (error) {
    console.log('Error sendFriendRequest in controller', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { idx: requestId } = req.params

    const friendRequest = await FriendRequest.findById(requestId)
    console.log(friendRequest)
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' })
    }
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to accept this friend request' })
    }

    friendRequest.status = 'accepted'
    await friendRequest.save()

    //  add each other as friends
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient }
    })
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender }
    })

    res.status(200).json({ success: true, message: 'Friend request accepted' })
  } catch (error) {
    console.log('Error acceptFriendRequest in controller', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({ recipient: req.user.id, status: 'pending' }).populate(
      'sender',
      'fullName profilePic nativeLanguage learningLanguage'
    )
    const acceptedReqs = await FriendRequest.find({ sender: req.user.id, status: 'accepted' }).populate(
      'recipient',
      'fullName profilePic nativeLanguage learningLanguage'
    )

    res.status(200).json({
      success: true,
      incomingReqs: incomingReqs,
      acceptedReqs: acceptedReqs
    })
  } catch (error) {
    console.log('Error getFriendRequests in controller', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getOutgoingFriendRequests(req, res) {
  try {
    const outgoingReqs = await FriendRequest.find({ sender: req.user.id, status: 'pending' }).populate(
      'recipient',
      'fullName profilePic nativeLanguage learningLanguage'
    )

    res.status(200).json({
      success: true,
      outgoingReqs: outgoingReqs
    })
  } catch (error) {
    console.log('Error getOutgoingFriendRequests in controller', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

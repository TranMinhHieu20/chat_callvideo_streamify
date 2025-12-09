import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/generateToken.js'
import User from '../models/User.js'
import { upsertStreamUser } from '../lib/stream.js'

// SIGNUP
export async function signup(req, res) {
  const { fullName, email, password } = req.body
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required!' })
    }
    //check emails valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }
    const emailUser = await User.findOne({ email })
    if (emailUser) {
      return res.status(400).json({ message: 'Email already exits' })
    }
    // check length passWord
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    //  random avatar
    const idx = Math.floor(Math.random() * 100 + 1) // generate a number between 1 to 100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
    // save data to Mongoose

    const newUser = User({
      fullName,
      email,
      password,
      profilePic: randomAvatar
    })

    const savedNewUser = await newUser.save()

    // todo: create the user in stream as well
    try {
      await upsertStreamUser({
        id: savedNewUser._id.toString(),
        name: savedNewUser.fullName,
        image: savedNewUser.profilePic
      })
    } catch (error) {
      console.log('Error creating Stream user:', error)
    }
    generateToken(savedNewUser, res)

    return res.status(201).json({
      success: true,
      user: savedNewUser
    })
  } catch (error) {
    console.error('Error in signup controller', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// LOGIN
export async function login(req, res) {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required!' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }
    generateToken(user._id, res)
    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error in login controller', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// LOGOUT
export async function logout(_, res) {
  try {
    res.clearCookie('jwtHieu', {
      maxAge: 0,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'development' ? false : true
    })
    res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('Error in logout controller', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// ONBOARDING
export async function onboard(req, res) {
  try {
    const userId = req.user._id
    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body

    if (!fullName || !nativeLanguage || !learningLanguage || location) {
      return res.status(400).json({
        message: 'Please fill in all required fields',
        missingFields: [
          !fullName && 'fullName',
          !nativeLanguage && 'nativeLanguage',
          !learningLanguage && 'learningLanguage',
          !location && 'location'
        ].filter(Boolean)
      })
    }
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnBoarded: true
      },
      { new: true }
    )
    if (!updateUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    // TODO: update the user in stream as well

    try {
      await upsertStreamUser({
        id: updateUser._id.toString(),
        name: updateUser.fullName,
        image: updateUser.profilePic || '',
        language: nativeLanguage
      })
    } catch (error) {
      console.error('Error updating Stream user:', error)
      return res.status(500).json({ message: 'Failed to update Stream user' })
    }

    res.status(200).json({ success: true, user: updateUser })
  } catch (error) {
    console.log('Error onboard in controller', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// GET ALL USERS
export async function getAllUsers(_, res) {
  try {
    const getAllUsers = await User.find().select('fullName email profilePic createdAt updatedAt')

    res.status(200).json(getAllUsers)
  } catch (error) {
    console.log('Get All User Failed', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

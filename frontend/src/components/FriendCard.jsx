import { Link } from 'react-router-dom'
import { LANGUAGE_TO_FLAG } from '../constants'

const FriendCard = ({ friend }) => {
  console.log(friend)
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="avatar size-12 rounded-full  ">
          <img src={friend.profilePic || '/avatar.png'} alt="avatar" className="rounded-full" />
        </div>
        <h3 className="font-semibold truncate">{friend.fullName}</h3>
      </div>
      {/*  */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="badge badge-secondary text-xs">
          {getLanguageFlag(friend.nativeLanguage)}
          Native: {friend.nativeLanguage}
        </span>
        <span className="badge badge-secondary text-xs">
          {getLanguageFlag(friend.learningLanguage)}
          Learning: {friend.nativeLanguage}
        </span>
      </div>
      {/* BTN */}
      <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full hover:btn-success">
        <span className="text">Message</span>
      </Link>
    </div>
  )
}

export default FriendCard

// eslint-disable-next-line
export function getLanguageFlag(lang) {
  if (!lang) return null

  const langLower = lang.toLowerCase()
  const countryCode = LANGUAGE_TO_FLAG[langLower]

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    )
  }
  return null
}

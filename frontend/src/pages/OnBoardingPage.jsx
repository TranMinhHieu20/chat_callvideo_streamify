import React, { useState, useRef } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import PageLoader from '../components/PageLoader'
import { onboard } from '../lib/api.js'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BookImage, CameraIcon, MapPinIcon, ShuffleIcon } from 'lucide-react'
import { LANGUAGES, LANGUAGE_TO_FLAG } from '../constants/index.js'

const OnBoardingPage = () => {
  const { isLoading, authUser } = useAuthUser()
  const [formState, setFormState] = useState({
    fullName: authUser.fullName || '',
    bio: authUser.bio || '',
    nativeLanguage: authUser.nativeLanguage || '',
    learningLanguage: authUser.learningLanguage || '',
    location: authUser.location || '',
    profilePic: authUser.profilePic || ''
  })

  const fileInputRef = useRef(null)

  const queryClient = useQueryClient()

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: onboard,
    onSuccess: () => {
      // handle success, maybe redirect or show a message
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
      toast.success('Onboarding completed successfully!')
    },

    onError: (error) => {
      // handle error, show error message
      toast.error(`Onboarding failed: ${error.message}`)
    }
  })

  const handleUpdate = (e) => {
    e.preventDefault(), onboardingMutation(formState)
  }

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1 // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

    setFormState({ ...formState, profilePic: randomAvatar })
    toast.success('Random profile picture generated!')
  }

  const handleImgUpLoad = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = async () => {
      const base64Img = reader.result
      setFormState({ ...formState, profilePic: base64Img })
      toast.success('Profile picture uploaded successfully!')
    }
  }
  if (isLoading) {
    return <PageLoader />
  }
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl text-center font-bold mb-6">Compete Your Profile</h1>
          <form onSubmit={handleUpdate} className="space-y-4">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic || '/avatar.png'}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center ">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              {/* Generate Random Avatar BTN */}
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current.click()
                  }}
                  className="btn btn-secondary"
                >
                  <BookImage className="size-4 mr-2" />
                  Choose Files
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImgUpLoad} />
              </div>
            </div>
            {/* FULLNAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name:</span>
              </label>
              <input
                type="text"
                name="fullName"
                className="input input-bordered w-full"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                placeholder="Your Full Name"
              />
            </div>
            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio:</span>
              </label>
              <textarea
                name="bio"
                className="textarea textarea-bordered h-24 w-full"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                placeholder="Tell others about yourself and language learning goals"
              />
            </div>
            {/* LANGUAGE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language:</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              {/* LANGUAGE FLAG */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language:</span>
                </label>
                <select
                  value={formState.learningLanguage}
                  onChange={(e) => {
                    setFormState({ ...formState, learningLanguage: e.target.value })
                  }}
                  className="select select-bordered w-full"
                  name="learningLanguage"
                >
                  <option value="">Select your learning language</option>
                  {LANGUAGES.map((langFlag) => (
                    <option key={langFlag} value={langFlag.toLowerCase()}>
                      {langFlag}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location:</span>
              </label>
              <div className="relative">
                <MapPinIcon className="size-5 absolute top-1/2 -translate-y-1/2 left-3 text-base-content opacity-70" />
                <input
                  className="input input-bordered w-full pl-10"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
            </div>
            {/* SUBMIT BTN */}
            <div className="form-control mt-6">
              <button type="submit" className={`btn btn-success ${isPending ? 'loading' : ''}`} disabled={isPending}>
                {isPending ? 'Submitting...' : 'Complete Onboarding'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnBoardingPage

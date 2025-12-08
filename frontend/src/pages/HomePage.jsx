import React from 'react'
import { toast } from 'sonner'

const HomePage = () => {
  return (
    <>
      <div>HomePage</div>
      <button
        onClick={() => {
          toast.success('ok')
        }}
      >
        click me
      </button>
    </>
  )
}

export default HomePage

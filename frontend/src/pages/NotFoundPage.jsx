import React from 'react'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-slate-50">
      <img className="max-w-full mb-6 w-96" src="404_NotFound.png" alt="NOTFOUND" />
      <a
        href="/"
        className="inline-block px-6 py-3 mt-6 font-medium text-black transition shadow-md bg-primary rounded-2xl hover:bg-primary-dark"
      >
        Quay về trang chủ!
      </a>
    </div>
  )
}

export default NotFoundPage

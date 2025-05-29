import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-6xl font-bold text-red-600 mb-4">404</div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-8 text-center">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound

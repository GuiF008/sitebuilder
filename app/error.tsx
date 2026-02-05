'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Une erreur est survenue
        </h1>
        <p className="text-gray-600 mb-4">{error.message}</p>
        {process.env.NODE_ENV === 'development' && error.stack && (
          <pre className="text-xs text-left bg-gray-100 p-4 rounded overflow-auto max-w-2xl mx-auto mb-4">
            {error.stack}
          </pre>
        )}
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}

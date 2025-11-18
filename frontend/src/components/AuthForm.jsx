const AuthForm = ({ title, subtitle, children, footer }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4">
      <div className="w-full max-w-md mx-auto mt-20 bg-white rounded-lg shadow-lg p-8 space-y-6">
        {(title || subtitle) && (
          <div className="text-center space-y-2">
            {title && <h1 className="text-3xl font-bold text-blue-600">{title}</h1>}
            {subtitle && <p className="text-gray-500">{subtitle}</p>}
          </div>
        )}
        {children}
        {footer && <div className="text-sm text-gray-600 text-center">{footer}</div>}
      </div>
    </div>
  )
}

export default AuthForm



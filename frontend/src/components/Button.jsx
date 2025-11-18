const VARIANTS = {
  primary: 'bg-blue-600 text-white focus:ring-blue-500',
  secondary: 'bg-green-500 text-white focus:ring-green-400',
  outline: 'bg-white text-blue-600 border border-blue-100 focus:ring-blue-500',
}

const Button = ({ variant = 'primary', className = '', type = 'button', children, ...props }) => {
  const variantClasses = VARIANTS[variant] ?? VARIANTS.primary
  const baseClasses =
    'py-2 px-4 rounded-lg font-semibold shadow-md transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

  return (
    <button type={type} className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button



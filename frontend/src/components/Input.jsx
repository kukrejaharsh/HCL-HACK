const Input = ({ label, as = 'input', className = '', ...props }) => {
  const Component = as === 'textarea' ? 'textarea' : 'input'
  const inputClasses =
    'w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400'

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
      {label && <span>{label}</span>}
      <Component className={`${inputClasses} ${className}`} {...props} />
    </label>
  )
}

export default Input



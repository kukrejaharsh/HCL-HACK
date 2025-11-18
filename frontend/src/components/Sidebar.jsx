import { NavLink } from 'react-router-dom'
import Button from './Button'

const Sidebar = ({ title = 'Healthcare Portal', links = [], onLogout = () => {} }) => {
  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-100 p-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">Portal</p>
        <h2 className="text-2xl font-bold text-blue-600">{title}</h2>
      </div>

      <nav className="mt-8 flex-1 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              [
                'block px-4 py-2 rounded-lg font-medium transition-colors',
                isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50',
              ].join(' ')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <Button variant="secondary" className="w-full mt-4" onClick={onLogout}>
        Logout
      </Button>
    </aside>
  )
}

export default Sidebar



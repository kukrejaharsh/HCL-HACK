import Sidebar from './Sidebar'

const DashboardLayout = ({ links = [], title = 'Dashboard', children, onLogout = () => {} }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 min-h-screen shadow-md">
        <Sidebar title={title} links={links} onLogout={onLogout} />
      </div>
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-6">{children}</div>
      </main>
    </div>
  )
}

export default DashboardLayout



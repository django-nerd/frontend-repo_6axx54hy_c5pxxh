import { useCallback, useState } from 'react'
import Header from './components/Header'
import AuthGate from './components/AuthGate'
import EmployeeDashboard from './components/EmployeeDashboard'
import CoreDashboard from './components/CoreDashboard'

function App() {
  const [user, setUser] = useState(null)

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  if (!user) {
    return <AuthGate onAuth={setUser} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header user={user} onLogout={handleLogout} />
      {user.role === 'core' ? (
        <CoreDashboard user={user} />
      ) : (
        <EmployeeDashboard user={user} />
      )}
    </div>
  )
}

export default App

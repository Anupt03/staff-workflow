import React, { useContext, useEffect, useState } from 'react'
import Login from './components/Auth/Login'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import SuperAdminDashboard from './components/Dashboard/SuperAdminDashboard'
import HRDashboard from './components/Dashboard/HRDashboard'
import { AuthContext } from './context/AuthProvider'
import { supabase, isSupabaseConfigured } from './utils/supabaseClient'
import { useToast } from './context/ToastContext'

const App = () => {
  const [user, setUser] = useState(null)
  const [loggedInUserData, setLoggedInUserData] = useState(null)
  const contextValue = useContext(AuthContext)
  const userData = Array.isArray(contextValue) ? contextValue[0] : null
  const { showToast } = useToast()

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')
    
    if (loggedInUser) {
      try {
        const parsedData = JSON.parse(loggedInUser)
        if (parsedData && parsedData.role) {
          setUser(parsedData.role)
          setLoggedInUserData(parsedData.data || null)
        }
      } catch (err) {
        console.error('Error parsing loggedInUser from localStorage', err)
      }
    }
  }, [])

  const handleLogin = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = password.trim()

    // 1. Try Supabase database login if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .eq('password', cleanPass)

        if (!error && profiles && profiles.length > 0) {
          const matchedProfile = profiles[0]
          const assignedRole = matchedProfile.role || 'employee'
          setUser(assignedRole)
          setLoggedInUserData(matchedProfile)
          localStorage.setItem('loggedInUser', JSON.stringify({ role: assignedRole, data: matchedProfile }))
          showToast(`Welcome back, ${matchedProfile.first_name || matchedProfile.firstName || 'User'}!`, 'success')
          return true
        }
      } catch (err) {
        console.warn('Supabase DB authentication check failed, using fallback:', err)
      }
    }

    // 2. Fallback to local / mock credential validation
    if (cleanEmail === 'superadmin@me.com' && cleanPass === '123') {
      setUser('superadmin')
      const data = { firstName: 'SuperAdmin', email: cleanEmail, role: 'superadmin', department: 'Executive' }
      setLoggedInUserData(data)
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'superadmin', data }))
      showToast('Welcome, SuperAdmin Executive!', 'success')
      return true
    } 
    
    if (cleanEmail === 'hr@me.com' && cleanPass === '123') {
      setUser('hr')
      const data = { firstName: 'HR Manager', email: cleanEmail, role: 'hr', department: 'Human Resources' }
      setLoggedInUserData(data)
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'hr', data }))
      showToast('Welcome, HR Manager!', 'success')
      return true
    }

    if ((cleanEmail === 'admin@me.com' || cleanEmail === 'admin@example.com') && cleanPass === '123') {
      setUser('admin')
      const data = { firstName: 'Admin Lead', email: cleanEmail, role: 'admin', department: 'Management' }
      setLoggedInUserData(data)
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin', data }))
      showToast('Welcome back, Admin Lead!', 'success')
      return true
    } 

    if (userData) {
      const account = userData.find((e) => e.email.toLowerCase() === cleanEmail && e.password === cleanPass)
      if (account) {
        const assignedRole = account.role || 'employee'
        setUser(assignedRole)
        setLoggedInUserData(account)
        localStorage.setItem('loggedInUser', JSON.stringify({ role: assignedRole, data: account }))
        showToast(`Welcome back, ${account.firstName}!`, 'success')
        return true
      }
    }

    showToast('Invalid email or password. Please try again.', 'error')
    return false
  }

  // Retrieve current active employee profile with live task state
  const currentEmployee = user === 'employee' && userData 
    ? userData.find((e) => e.email.toLowerCase() === loggedInUserData?.email?.toLowerCase() || e.id === loggedInUserData?.id) || loggedInUserData 
    : loggedInUserData

  return (
    <>
      {!user ? <Login handleLogin={handleLogin} /> : ''}
      {user === 'superadmin' ? (
        <SuperAdminDashboard changeUser={setUser} data={loggedInUserData} />
      ) : user === 'hr' ? (
        <HRDashboard changeUser={setUser} data={loggedInUserData} />
      ) : user === 'admin' ? (
        <AdminDashboard changeUser={setUser} data={loggedInUserData} />
      ) : user === 'employee' ? (
        <EmployeeDashboard changeUser={setUser} data={currentEmployee} />
      ) : null}
    </>
  )
}

export default App
import React, { useContext, useEffect, useState } from 'react'
import Login from './components/Auth/Login'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
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
    // 1. Try Supabase database login if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email.trim())
          .eq('password', password.trim())

        if (!error && profiles && profiles.length > 0) {
          const matchedProfile = profiles[0]
          if (matchedProfile.role === 'admin') {
            setUser('admin')
            setLoggedInUserData(matchedProfile)
            localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin', data: matchedProfile }))
            showToast('Welcome back, Admin!', 'success')
            return true
          } else {
            setUser('employee')
            setLoggedInUserData(matchedProfile)
            localStorage.setItem('loggedInUser', JSON.stringify({ role: 'employee', data: matchedProfile }))
            showToast(`Welcome back, ${matchedProfile.first_name || matchedProfile.firstName || 'Employee'}!`, 'success')
            return true
          }
        }
      } catch (err) {
        console.warn('Supabase DB authentication check failed, using fallback:', err)
      }
    }

    // 2. Fallback to local / mock credential validation
    const cleanEmail = email.trim().toLowerCase()
    if ((cleanEmail === 'admin@me.com' || cleanEmail === 'admin@example.com') && password === '123') {
      setUser('admin')
      setLoggedInUserData({ firstName: 'Admin', email: cleanEmail, role: 'admin' })
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin', data: { firstName: 'Admin', email: cleanEmail } }))
      showToast('Welcome back, Admin!', 'success')
      return true
    } else if (userData) {
      const employee = userData.find((e) => e.email.toLowerCase() === cleanEmail && e.password === password)
      if (employee) {
        setUser('employee')
        setLoggedInUserData(employee)
        localStorage.setItem('loggedInUser', JSON.stringify({ role: 'employee', data: employee }))
        showToast(`Welcome back, ${employee.firstName}!`, 'success')
        return true
      } else {
        showToast('Invalid email or password. Please try again.', 'error')
        return false
      }
    } else {
      showToast('Invalid email or password. Please try again.', 'error')
      return false
    }
  }

  // Retrieve current active employee profile with live task state
  const currentEmployee = user === 'employee' && userData 
    ? userData.find((e) => e.email.toLowerCase() === loggedInUserData?.email?.toLowerCase() || e.id === loggedInUserData?.id) || loggedInUserData 
    : loggedInUserData

  return (
    <>
      {!user ? <Login handleLogin={handleLogin} /> : ''}
      {user === 'admin' ? (
        <AdminDashboard changeUser={setUser} />
      ) : user === 'employee' ? (
        <EmployeeDashboard changeUser={setUser} data={currentEmployee} />
      ) : null}
    </>
  )
}

export default App
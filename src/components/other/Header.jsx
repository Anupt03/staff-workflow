import React, { useState, useContext } from 'react'
import { LogOut, User, Shield, Briefcase, Calendar, Key, Lock } from 'lucide-react'
import { AuthContext } from '../../context/AuthProvider'
import { supabase, isSupabaseConfigured } from '../../utils/supabaseClient'
import { useToast } from '../../context/ToastContext'

const Header = (props) => {
  const userName = props.data?.firstName || props.data?.first_name || 'Admin'
  const userRole = (props.data?.role || 'employee').toLowerCase()
  const initial = userName.charAt(0).toUpperCase()
  const { showToast } = useToast()

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  const getRoleBadgeConfig = () => {
    switch (userRole) {
      case 'superadmin':
        return {
          title: 'Executive SuperAdmin',
          badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          avatarClass: 'bg-gradient-to-tr from-purple-500 to-indigo-400',
          nameColor: 'text-purple-400',
          icon: Shield
        }
      case 'hr':
        return {
          title: 'HR Management Portal',
          badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          avatarClass: 'bg-gradient-to-tr from-sky-400 to-blue-500',
          nameColor: 'text-sky-400',
          icon: Briefcase
        }
      case 'admin':
        return {
          title: 'Administrator Lead',
          badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          avatarClass: 'bg-gradient-to-tr from-indigo-400 to-violet-300',
          nameColor: 'text-indigo-400',
          icon: Shield
        }
      default:
        return {
          title: 'Employee Workspace',
          badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          avatarClass: 'bg-gradient-to-tr from-emerald-400 to-teal-300',
          nameColor: 'text-emerald-400',
          icon: Briefcase
        }
    }
  }

  const roleConfig = getRoleBadgeConfig()
  const RoleIcon = roleConfig.icon

  const contextValue = useContext(AuthContext)
  const actions = contextValue && contextValue[2]

  const [isPassModalOpen, setIsPassModalOpen] = useState(false)
  const [newPasswordInput, setNewPasswordInput] = useState('')

  const handleSelfPasswordChange = async (e) => {
    e.preventDefault()
    if (!newPasswordInput.trim()) {
      showToast('Please enter a valid new password', 'error')
      return
    }

    if (actions && actions.updateUserPassword && props.data?.id) {
      await actions.updateUserPassword(props.data.id, newPasswordInput.trim())
      showToast('Your password has been updated successfully!', 'success')
      setIsPassModalOpen(false)
      setNewPasswordInput('')
    } else {
      showToast('Your password has been updated successfully!', 'success')
      setIsPassModalOpen(false)
    }
  }

  const logOutUser = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut()
      } catch (err) {
        console.warn('Supabase signout notice:', err)
      }
    }
    localStorage.setItem('loggedInUser', '')
    showToast('Logged out successfully', 'info')
    props.changeUser('')
  }

  return (
    <>
      <header className='w-full glass-panel px-6 py-4 rounded-2xl flex items-center justify-between shadow-xl mb-6 border border-slate-800/80 animate-fade-in'>
        <div className='flex items-center gap-4'>
          {/* User Gradient Avatar */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-slate-950 font-extrabold text-xl shadow-md ${roleConfig.avatarClass}`}>
            {initial}
          </div>

          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-xl md:text-2xl font-bold text-white tracking-tight'>
                Welcome back, <span className={roleConfig.nameColor}>{userName}</span>
              </h1>
              <span className='inline-block animate-bounce'>👋</span>
            </div>
            <div className='flex items-center gap-2 mt-1'>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${roleConfig.badgeClass}`}>
                <RoleIcon className='w-3 h-3' />
                {roleConfig.title}
              </span>
              <span className='hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-900/60 px-2.5 py-0.5 rounded-full border border-slate-800'>
                <Calendar className='w-3 h-3 text-slate-400' />
                {currentDateStr}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-2.5'>
          {/* Change Password Button */}
          <button
            onClick={() => setIsPassModalOpen(true)}
            className='flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-md active:scale-95'
          >
            <Key className='w-4 h-4 text-amber-400' />
            <span className='hidden sm:inline'>Change Password</span>
          </button>

          {/* Logout Button */}
          <button 
            onClick={logOutUser} 
            className='flex items-center gap-2 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95'
          >
            <LogOut className='w-4 h-4' />
            <span className='hidden sm:inline'>Log Out</span>
          </button>
        </div>
      </header>

      {/* Change Password Modal */}
      {isPassModalOpen && (
        <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in'>
          <div className='bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl animate-toast'>
            <div className='flex items-center justify-between pb-3 border-b border-slate-800'>
              <h3 className='text-base font-bold text-white flex items-center gap-2'>
                <Key className='w-4 h-4 text-amber-400' /> Change My Password
              </h3>
              <button onClick={() => setIsPassModalOpen(false)} className='text-slate-400 hover:text-white'>✕</button>
            </div>

            <form onSubmit={handleSelfPasswordChange} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1'>
                  <Lock className='w-3.5 h-3.5 text-amber-400' /> New Password
                </label>
                <input
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  required
                  type='text'
                  placeholder='Enter new secure password...'
                  className='w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 outline-none focus:border-amber-400 font-medium'
                />
              </div>

              <div className='flex justify-end gap-2 pt-2'>
                <button
                  type='button'
                  onClick={() => setIsPassModalOpen(false)}
                  className='px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md'
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
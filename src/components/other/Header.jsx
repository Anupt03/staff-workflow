import React from 'react'
import { LogOut, User, Shield, Briefcase, Calendar } from 'lucide-react'
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

      {/* Logout Button */}
      <button 
        onClick={logOutUser} 
        className='flex items-center gap-2 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95'
      >
        <LogOut className='w-4 h-4' />
        <span className='hidden sm:inline'>Log Out</span>
      </button>
    </header>
  )
}

export default Header
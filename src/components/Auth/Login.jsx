import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles, UserCheck, Loader2 } from 'lucide-react'

const Login = ({ handleLogin }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!email.trim() || !password.trim()) return

        setIsSubmitting(true)
        try {
            await handleLogin(email, password)
        } finally {
            setIsSubmitting(false)
        }
    }

    const fillDemoAdmin = () => {
        setEmail("admin@me.com")
        setPassword("123")
    }

    const fillDemoEmployee = (empEmail = "e@e.com") => {
        setEmail(empEmail)
        setPassword("123")
    }

    return (
        <div className='relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden px-4'>
            {/* Ambient Animated Mesh Background Glows */}
            <div className='absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse'></div>
            <div className='absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-1000'></div>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none'></div>

            {/* Login Glass Card */}
            <div className='relative z-10 w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-800/80 animate-fade-in'>
                {/* Brand Header */}
                <div className='flex flex-col items-center mb-8 text-center'>
                    <div className='w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 transform hover:scale-105 transition-transform'>
                        <ShieldCheck className='w-8 h-8 text-slate-950 stroke-[2.5]' />
                    </div>
                    <h1 className='text-3xl font-extrabold text-white tracking-tight flex items-center gap-2'>
                        EMS <span className='text-emerald-400 font-bold'>Pro</span>
                    </h1>
                    <p className='text-sm text-slate-400 mt-1 font-medium'>Sign in to manage your workforce & active tasks</p>
                </div>

                {/* Form */}
                <form onSubmit={submitHandler} className='flex flex-col space-y-4'>
                    {/* Email Input */}
                    <div>
                        <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5'>
                            Email Address
                        </label>
                        <div className='relative flex items-center'>
                            <Mail className='absolute left-4 w-5 h-5 text-slate-400 pointer-events-none' />
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                type="email"
                                placeholder='admin@me.com or e@e.com'
                                className='w-full bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm rounded-xl py-3 pl-11 pr-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium'
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5'>
                            Password
                        </label>
                        <div className='relative flex items-center'>
                            <Lock className='absolute left-4 w-5 h-5 text-slate-400 pointer-events-none' />
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                type={showPassword ? "text" : "password"}
                                placeholder='••••••••'
                                className='w-full bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm rounded-xl py-3 pl-11 pr-11 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium'
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-4 text-slate-400 hover:text-slate-200 transition-colors'
                            >
                                {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className='w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-70 text-slate-950 font-bold text-base py-3 px-6 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2'
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className='w-5 h-5 animate-spin text-slate-950' />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Sign In to Dashboard</span>
                        )}
                    </button>
                </form>

                {/* Quick Demo Credentials Autofill Section */}
                <div className='mt-8 pt-6 border-t border-slate-800/80 text-center'>
                    <div className='flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold mb-3'>
                        <Sparkles className='w-3.5 h-3.5 text-amber-400' />
                        <span>Quick Demo Shortcuts (1-Click Fill):</span>
                    </div>
                    <div className='grid grid-cols-2 gap-2.5'>
                        <button
                            type="button"
                            onClick={fillDemoAdmin}
                            className='flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-slate-200 py-2.5 px-3 rounded-lg border border-slate-700/60 hover:border-emerald-500/50 transition-all'
                        >
                            <UserCheck className='w-3.5 h-3.5 text-emerald-400' />
                            <span>Admin Demo</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemoEmployee("e@e.com")}
                            className='flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-slate-200 py-2.5 px-3 rounded-lg border border-slate-700/60 hover:border-blue-500/50 transition-all'
                        >
                            <UserCheck className='w-3.5 h-3.5 text-blue-400' />
                            <span>Arjun (Employee)</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
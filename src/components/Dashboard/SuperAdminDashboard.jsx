import React, { useState } from 'react'
import Header from '../other/Header'
import CreateTask from '../other/CreateTask'
import AllTask from '../other/AllTask'
import UserManagement from '../other/UserManagement'
import { Shield, Send, Users } from 'lucide-react'

const SuperAdminDashboard = (props) => {
    const [activeTab, setActiveTab] = useState('staff')

    return (
        <div className='min-h-screen w-full bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 relative overflow-x-hidden'>
            {/* Ambient Purple Glows */}
            <div className='absolute -top-32 -left-32 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none'></div>
            <div className='absolute top-1/3 -right-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none'></div>

            <div className='max-w-7xl mx-auto relative z-10 space-y-6'>
                <Header changeUser={props.changeUser} data={props.data} />

                {/* Role Banner */}
                <div className='bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/30 p-4 rounded-2xl flex items-center justify-between shadow-xl'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300'>
                            <Shield className='w-6 h-6' />
                        </div>
                        <div>
                            <h2 className='text-base font-bold text-white flex items-center gap-2'>
                                Executive SuperAdmin Control Console
                            </h2>
                            <p className='text-xs text-purple-200/70'>Global ownership: Manage roles, company workforce, passwords, and task dispatches</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Navigation Tabs */}
                <div className='flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 w-fit text-sm font-semibold'>
                    <button
                        onClick={() => setActiveTab('staff')}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === 'staff' 
                                ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/20' 
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Users className='w-4 h-4' />
                        <span>Workforce Onboarding & Roles</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === 'tasks' 
                                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20' 
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Send className='w-4 h-4' />
                        <span>Task Dispatch & Monitor</span>
                    </button>
                </div>

                {/* Tab Views */}
                {activeTab === 'staff' ? (
                    <UserManagement />
                ) : (
                    <>
                        <CreateTask />
                        <AllTask />
                    </>
                )}
            </div>
        </div>
    )
}

export default SuperAdminDashboard

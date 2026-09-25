import React, { useState } from 'react'
import Header from '../other/Header'
import CreateTask from '../other/CreateTask'
import AllTask from '../other/AllTask'
import UserManagement from '../other/UserManagement'
import { Send, Users } from 'lucide-react'

const AdminDashboard = (props) => {
    const [activeTab, setActiveTab] = useState('tasks')

    return (
        <div className='min-h-screen w-full bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 relative overflow-x-hidden'>
            {/* Ambient Background Glows */}
            <div className='absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none'></div>
            <div className='absolute top-1/3 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none'></div>

            <div className='max-w-7xl mx-auto relative z-10 space-y-6'>
                <Header changeUser={props.changeUser} data={props.data} />

                {/* Dashboard Navigation Tabs */}
                <div className='flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 w-fit text-sm font-semibold'>
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
                    <button
                        onClick={() => setActiveTab('staff')}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === 'staff' 
                                ? 'bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/20' 
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Users className='w-4 h-4' />
                        <span>Staff Onboarding & Directory</span>
                    </button>
                </div>

                {/* Tab Views */}
                {activeTab === 'tasks' ? (
                    <>
                        <CreateTask />
                        <AllTask />
                    </>
                ) : (
                    <UserManagement />
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
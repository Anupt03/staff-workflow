import React, { useState } from 'react'
import Header from '../other/Header'
import UserManagement from '../other/UserManagement'
import AllTask from '../other/AllTask'
import { Briefcase, Users, Activity } from 'lucide-react'

const HRDashboard = (props) => {
    const [activeTab, setActiveTab] = useState('onboarding')

    return (
        <div className='min-h-screen w-full bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 relative overflow-x-hidden'>
            {/* Ambient Sky Glows */}
            <div className='absolute -top-32 -left-32 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none'></div>
            <div className='absolute top-1/3 -right-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none'></div>

            <div className='max-w-7xl mx-auto relative z-10 space-y-6'>
                <Header changeUser={props.changeUser} data={props.data} />

                {/* Role Banner */}
                <div className='bg-gradient-to-r from-sky-950/60 via-slate-900 to-teal-950/40 border border-sky-500/30 p-4 rounded-2xl flex items-center justify-between shadow-xl'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300'>
                            <Briefcase className='w-6 h-6' />
                        </div>
                        <div>
                            <h2 className='text-base font-bold text-white flex items-center gap-2'>
                                Human Resources (HR) Management Portal
                            </h2>
                            <p className='text-xs text-sky-200/70'>Staff Onboarding, Department Placement, Password Resets & Workload Auditing</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Navigation Tabs */}
                <div className='flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 w-fit text-sm font-semibold'>
                    <button
                        onClick={() => setActiveTab('onboarding')}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === 'onboarding' 
                                ? 'bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/20' 
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Users className='w-4 h-4' />
                        <span>Staff Onboarding & Directory</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('monitor')}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === 'monitor' 
                                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20' 
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Activity className='w-4 h-4' />
                        <span>Workforce Task Monitor</span>
                    </button>
                </div>

                {/* Tab Views */}
                {activeTab === 'onboarding' ? (
                    <UserManagement />
                ) : (
                    <AllTask />
                )}
            </div>
        </div>
    )
}

export default HRDashboard

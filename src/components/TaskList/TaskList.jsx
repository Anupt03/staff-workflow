import React, { useState } from 'react'
import AcceptTask from './AcceptTask'
import NewTask from './NewTask'
import CompleteTask from './CompleteTask'
import FailedTask from './FailedTask'
import { Inbox, Search, Filter } from 'lucide-react'

const TaskList = ({ data }) => {
    const [activeTab, setActiveTab] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    const allTasks = data?.tasks || []

    const filteredTasks = allTasks.filter(task => {
        const matchesSearch = 
            (task.taskTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.taskDescription || '').toLowerCase().includes(searchTerm.toLowerCase())

        if (!matchesSearch) return false

        if (activeTab === 'new') return task.newTask
        if (activeTab === 'active') return task.active
        if (activeTab === 'completed') return task.completed
        if (activeTab === 'failed') return task.failed
        return true
    })

    const countNew = allTasks.filter(t => t.newTask).length
    const countActive = allTasks.filter(t => t.active).length
    const countCompleted = allTasks.filter(t => t.completed).length
    const countFailed = allTasks.filter(t => t.failed).length

    return (
        <div className='mt-8 space-y-4 animate-fade-in'>
            {/* Header Toolbar: Filters & Search */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800/80'>
                {/* Filter Tabs */}
                <div className='flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-semibold'>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                            activeTab === 'all' 
                                ? 'bg-slate-100 text-slate-950 font-bold shadow-md' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                    >
                        <Filter className='w-3.5 h-3.5' />
                        <span>All ({allTasks.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('new')}
                        className={`px-3.5 py-2 rounded-xl transition-all ${
                            activeTab === 'new' 
                                ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20' 
                                : 'text-sky-400 hover:bg-sky-500/10'
                        }`}
                    >
                        New ({countNew})
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-3.5 py-2 rounded-xl transition-all ${
                            activeTab === 'active' 
                                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                                : 'text-amber-400 hover:bg-amber-500/10'
                        }`}
                    >
                        In Progress ({countActive})
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`px-3.5 py-2 rounded-xl transition-all ${
                            activeTab === 'completed' 
                                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20' 
                                : 'text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                    >
                        Completed ({countCompleted})
                    </button>
                    <button
                        onClick={() => setActiveTab('failed')}
                        className={`px-3.5 py-2 rounded-xl transition-all ${
                            activeTab === 'failed' 
                                ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20' 
                                : 'text-rose-400 hover:bg-rose-500/10'
                        }`}
                    >
                        Failed ({countFailed})
                    </button>
                </div>

                {/* Search Bar */}
                <div className='relative w-full md:w-60 shrink-0'>
                    <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none' />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type="text"
                        placeholder="Search your tasks..."
                        className="w-full bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs rounded-xl py-2 pl-9 pr-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Task Cards List / Container */}
            {filteredTasks.length === 0 ? (
                <div className='glass-panel p-10 rounded-2xl text-center text-slate-400 border border-slate-800/80 flex flex-col items-center justify-center gap-3 min-h-[220px]'>
                    <div className='w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner'>
                        <Inbox className='w-6 h-6' />
                    </div>
                    <div>
                        <h3 className='text-base font-bold text-slate-200'>No Tasks Found</h3>
                        <p className='text-xs text-slate-400 mt-1'>No task items match your current filter or search criteria.</p>
                    </div>
                </div>
            ) : (
                <div id='tasklist' className='flex items-stretch justify-start gap-5 overflow-x-auto w-full py-2 pb-4 scroll-smooth'>
                    {filteredTasks.map((elem, idx) => {
                        if (elem.active) {
                            return <AcceptTask key={elem.id || idx} data={elem} employeeId={data?.id} />
                        }
                        if (elem.newTask) {
                            return <NewTask key={elem.id || idx} data={elem} employeeId={data?.id} />
                        }
                        if (elem.completed) {
                            return <CompleteTask key={elem.id || idx} data={elem} employeeId={data?.id} />
                        }
                        if (elem.failed) {
                            return <FailedTask key={elem.id || idx} data={elem} employeeId={data?.id} />
                        }
                        return null
                    })}
                </div>
            )}
        </div>
    )
}

export default TaskList
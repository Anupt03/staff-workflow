import React, { useContext, useState } from 'react'
import { PlusCircle, Calendar, User, Tag, FileText, Send, CheckCircle, Sparkles } from 'lucide-react'
import { AuthContext } from '../../context/AuthProvider'
import { useToast } from '../../context/ToastContext'

const CreateTask = () => {
    const contextValue = useContext(AuthContext)
    const userData = Array.isArray(contextValue) ? contextValue[0] : null
    const actions = contextValue && contextValue[2]
    const { showToast } = useToast()

    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskDate, setTaskDate] = useState('')
    const [asignTo, setAsignTo] = useState('')
    const [customAssign, setCustomAssign] = useState('')
    const [category, setCategory] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const categoriesList = ['Design', 'Development', 'QA', 'DevOps', 'Database', 'Meeting', 'Support']

    const submitHandler = async (e) => {
        e.preventDefault()

        const finalAssignee = asignTo === 'custom' ? customAssign.trim() : asignTo.trim()

        if (!finalAssignee || !taskTitle.trim()) {
            showToast('Please fill out the Task Title and select an Assignee!', 'error')
            return
        }

        if (actions && actions.createTask) {
            await actions.createTask({
                taskTitle,
                taskDescription,
                taskDate,
                category: category || 'General',
                asignTo: finalAssignee
            })
        }

        setIsSubmitted(true)
        showToast(`Task "${taskTitle}" assigned to ${finalAssignee}!`, 'success')
        setTimeout(() => setIsSubmitted(false), 3000)

        setTaskTitle('')
        setCategory('')
        setAsignTo('')
        setCustomAssign('')
        setTaskDate('')
        setTaskDescription('')
    }

    return (
        <div className='glass-panel p-6 rounded-2xl shadow-xl mt-6 border border-slate-800/80 animate-fade-in'>
            <div className='flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner'>
                    <PlusCircle className='w-5 h-5' />
                </div>
                <div>
                    <h2 className='text-lg font-bold text-white tracking-tight flex items-center gap-2'>
                        Assign New Workforce Task
                        <span className='text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'>Admin Access</span>
                    </h2>
                    <p className='text-xs text-slate-400'>Dispatch tasks directly to team members with real-time sync</p>
                </div>
            </div>

            <form onSubmit={submitHandler} className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
                {/* Left Column: Task Metadata Fields */}
                <div className='lg:col-span-6 space-y-4'>
                    {/* Task Title */}
                    <div>
                        <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5'>
                            Task Title *
                        </label>
                        <input
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            required
                            type="text"
                            placeholder='e.g., Revamp User Profile Dashboard'
                            className='w-full bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm rounded-xl py-2.5 px-3.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium'
                        />
                    </div>

                    {/* Assign To Employee (Dropdown + Custom input option) */}
                    <div>
                        <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1'>
                            <User className='w-3.5 h-3.5 text-emerald-400' />
                            Assign To Employee *
                        </label>
                        <select
                            value={asignTo}
                            onChange={(e) => setAsignTo(e.target.value)}
                            required
                            className='w-full bg-slate-900/80 border border-slate-700/80 text-white text-sm rounded-xl py-2.5 px-3.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium cursor-pointer'
                        >
                            <option value="" disabled>Select an employee from directory...</option>
                            {(userData || []).map((emp) => (
                                <option key={emp.id || emp.firstName} value={emp.firstName} className='bg-slate-950 text-white'>
                                    {emp.firstName} ({emp.email})
                                </option>
                            ))}
                            <option value="custom" className='bg-slate-950 text-emerald-400 font-bold'>+ Custom / Add New Name</option>
                        </select>

                        {asignTo === 'custom' && (
                            <input
                                value={customAssign}
                                onChange={(e) => setCustomAssign(e.target.value)}
                                required
                                type="text"
                                placeholder='Type new employee name...'
                                className='w-full mt-2 bg-slate-900/80 border border-emerald-500/50 text-white placeholder-slate-500 text-sm rounded-xl py-2.5 px-3.5 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium animate-fade-in'
                            />
                        )}
                    </div>

                    {/* Due Date & Category Grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1'>
                                <Calendar className='w-3.5 h-3.5 text-slate-400' />
                                Due Date
                            </label>
                            <input
                                value={taskDate}
                                onChange={(e) => setTaskDate(e.target.value)}
                                type="date"
                                className='w-full bg-slate-900/80 border border-slate-700/80 text-white text-sm rounded-xl py-2.5 px-3.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium'
                            />
                        </div>

                        <div>
                            <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1'>
                                <Tag className='w-3.5 h-3.5 text-slate-400' />
                                Category
                            </label>
                            <input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                type="text"
                                placeholder='Design, Dev, QA, DevOps'
                                className='w-full bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm rounded-xl py-2.5 px-3.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium'
                            />
                        </div>
                    </div>

                    {/* Category Quick Selector Pills */}
                    <div>
                        <span className='block text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1'>
                            <Sparkles className='w-3 h-3 text-amber-400' /> Quick Categories:
                        </span>
                        <div className='flex flex-wrap gap-1.5'>
                            {categoriesList.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                                        category === cat 
                                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold' 
                                            : 'bg-slate-900/70 text-slate-300 border-slate-700/70 hover:border-slate-500'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Description & Action */}
                <div className='lg:col-span-6 flex flex-col h-full justify-between'>
                    <div>
                        <label className='block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1'>
                            <FileText className='w-3.5 h-3.5 text-slate-400' />
                            Task Description
                        </label>
                        <textarea
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            rows="6"
                            placeholder='Provide clear guidelines, expected outcomes, and context for the assigned team member...'
                            className='w-full bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm rounded-xl p-3.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium resize-none'
                        ></textarea>
                    </div>

                    <div className='mt-4'>
                        <button
                            type="submit"
                            className={`w-full font-bold text-sm py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                                isSubmitted 
                                    ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 active:scale-[0.99]'
                            }`}
                        >
                            {isSubmitted ? (
                                <>
                                    <CheckCircle className='w-5 h-5 animate-bounce' />
                                    <span>Task Dispatched Successfully!</span>
                                </>
                            ) : (
                                <>
                                    <Send className='w-4 h-4' />
                                    <span>Dispatch Task to Team</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateTask
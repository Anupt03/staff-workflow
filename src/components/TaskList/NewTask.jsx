import React, { useContext } from 'react'
import { Sparkles, Calendar, ArrowRight } from 'lucide-react'
import { AuthContext } from '../../context/AuthProvider'
import { useToast } from '../../context/ToastContext'

const NewTask = ({ data, employeeId }) => {
    const contextValue = useContext(AuthContext)
    const actions = contextValue && contextValue[2]
    const { showToast } = useToast()

    const handleAccept = async () => {
        if (actions && actions.updateTaskStatus) {
            await actions.updateTaskStatus(data.id || data.taskTitle, 'active', employeeId)
            showToast(`Task "${data.taskTitle}" accepted! Moving to active.`, 'info')
        }
    }

    return (
        <div className='flex-shrink-0 w-80 min-h-[260px] glass-panel p-5 rounded-2xl border border-sky-500/30 glass-card-hover flex flex-col justify-between relative overflow-hidden group'>
            {/* Top Accent Bar */}
            <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-blue-600'></div>

            <div>
                {/* Badge & Date */}
                <div className='flex justify-between items-center mb-3'>
                    <span className='bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 uppercase tracking-wider'>
                        <Sparkles className='w-3 h-3' />
                        {data.category || 'General'}
                    </span>
                    <span className='text-xs text-slate-400 font-semibold flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800'>
                        <Calendar className='w-3 h-3 text-slate-400' />
                        {data.taskDate || 'No Date'}
                    </span>
                </div>

                {/* Title & Description */}
                <h2 className='text-lg font-bold text-white tracking-tight line-clamp-2 group-hover:text-sky-300 transition-colors'>
                    {data.taskTitle}
                </h2>
                <p className='text-xs text-slate-300 mt-2 line-clamp-4 leading-relaxed font-medium'>
                    {data.taskDescription}
                </p>
            </div>

            {/* Action Button */}
            <div className='mt-5 pt-3 border-t border-slate-800/80'>
                <button
                    onClick={handleAccept}
                    className='w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-95'
                >
                    <span>Accept Task</span>
                    <ArrowRight className='w-3.5 h-3.5' />
                </button>
            </div>
        </div>
    )
}

export default NewTask
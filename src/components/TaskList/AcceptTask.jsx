import React, { useContext } from 'react'
import { Clock, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import { AuthContext } from '../../context/AuthProvider'
import { useToast } from '../../context/ToastContext'

const AcceptTask = ({ data, employeeId }) => {
    const contextValue = useContext(AuthContext)
    const actions = contextValue && contextValue[2]
    const { showToast } = useToast()

    const handleComplete = async () => {
        if (actions && actions.updateTaskStatus) {
            await actions.updateTaskStatus(data.id || data.taskTitle, 'completed', employeeId)
            showToast(`Task "${data.taskTitle}" marked as completed!`, 'success')
        }
    }

    const handleFail = async () => {
        if (actions && actions.updateTaskStatus) {
            await actions.updateTaskStatus(data.id || data.taskTitle, 'failed', employeeId)
            showToast(`Task "${data.taskTitle}" marked as failed.`, 'error')
        }
    }

    return (
        <div className='flex-shrink-0 w-80 min-h-[260px] glass-panel p-5 rounded-2xl border border-amber-500/30 glass-card-hover flex flex-col justify-between relative overflow-hidden group'>
            {/* Top Accent Bar */}
            <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600'></div>

            <div>
                {/* Category & Date */}
                <div className='flex justify-between items-center mb-3'>
                    <span className='bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 uppercase tracking-wider'>
                        <Clock className='w-3 h-3' />
                        {data.category || 'General'}
                    </span>
                    <span className='text-xs text-slate-400 font-semibold flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800'>
                        <Calendar className='w-3 h-3 text-slate-400' />
                        {data.taskDate || 'No Date'}
                    </span>
                </div>

                {/* Title & Description */}
                <h2 className='text-lg font-bold text-white tracking-tight line-clamp-2 group-hover:text-amber-300 transition-colors'>
                    {data.taskTitle}
                </h2>
                <p className='text-xs text-slate-300 mt-2 line-clamp-4 leading-relaxed font-medium'>
                    {data.taskDescription}
                </p>
            </div>

            {/* Action Buttons */}
            <div className='mt-5 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2'>
                <button
                    onClick={handleComplete}
                    className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2 px-3 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1 active:scale-95'
                >
                    <CheckCircle2 className='w-3.5 h-3.5' />
                    <span>Complete</span>
                </button>
                <button
                    onClick={handleFail}
                    className='bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1 active:scale-95'
                >
                    <XCircle className='w-3.5 h-3.5' />
                    <span>Fail</span>
                </button>
            </div>
        </div>
    )
}

export default AcceptTask
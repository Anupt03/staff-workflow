import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const showToast = useCallback((message, type = 'info', duration = 3500) => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev, { id, message, type }])

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, duration)
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-2xl backdrop-blur-xl border border-slate-700/80 animate-toast ${
                            toast.type === 'success' 
                                ? 'bg-slate-900/90 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10' 
                                : toast.type === 'error'
                                ? 'bg-slate-900/90 text-rose-300 border-rose-500/40 shadow-rose-500/10'
                                : 'bg-slate-900/90 text-sky-300 border-sky-500/40 shadow-sky-500/10'
                        }`}
                    >
                        <div className="flex items-center gap-3 pr-2">
                            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
                            <span className="text-xs font-semibold text-slate-100 leading-snug">{toast.message}</span>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        return { showToast: (msg) => console.log('Toast:', msg) }
    }
    return context
}

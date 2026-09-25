import React, { useContext, useState } from 'react'
import { UserPlus, Users, Search, Shield, Key, Trash2, Mail, Lock, Building, CheckCircle2, UserCheck, Briefcase } from 'lucide-react'
import { AuthContext } from '../../context/AuthProvider'
import { useToast } from '../../context/ToastContext'

const UserManagement = () => {
    const contextValue = useContext(AuthContext)
    const userData = Array.isArray(contextValue) ? contextValue[0] : null
    const actions = contextValue && contextValue[2]
    const { showToast } = useToast()

    // Form state for creating/onboarding new staff
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('123')
    const [role, setRole] = useState('employee')
    const [department, setDepartment] = useState('Engineering')

    // Directory filter & search
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRoleFilter, setSelectedRoleFilter] = useState('all')

    // Password reset modal state
    const [editingUser, setEditingUser] = useState(null)
    const [newPass, setNewPass] = useState('')

    const allStaff = userData || []

    const filteredStaff = allStaff.filter(emp => {
        const matchesSearch = 
            (emp.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase())
        
        if (!matchesSearch) return false

        if (selectedRoleFilter !== 'all') {
            return (emp.role || 'employee').toLowerCase() === selectedRoleFilter.toLowerCase()
        }

        return true
    })

    const handleCreateUser = async (e) => {
        e.preventDefault()

        if (!firstName.trim() || !email.trim()) {
            showToast('Please provide both Name and Email!', 'error')
            return
        }

        if (actions && actions.createUserAccount) {
            const success = await actions.createUserAccount({
                firstName: firstName.trim(),
                email: email.trim(),
                password: password.trim() || '123',
                role,
                department
            })

            if (success) {
                showToast(`Staff member "${firstName}" (${role.toUpperCase()}) onboarded!`, 'success')
                setFirstName('')
                setEmail('')
                setPassword('123')
            }
        }
    }

    const handleResetPassword = async (userId, userName) => {
        if (!newPass.trim()) {
            showToast('Please enter a new password', 'error')
            return
        }

        if (actions && actions.updateUserPassword) {
            await actions.updateUserPassword(userId, newPass.trim())
            showToast(`Password for ${userName} updated successfully!`, 'success')
            setEditingUser(null)
            setNewPass('')
        }
    }

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to remove ${userName} from the workspace?`)) {
            if (actions && actions.deleteUserAccount) {
                await actions.deleteUserAccount(userId)
                showToast(`Removed ${userName} from workspace.`, 'info')
            }
        }
    }

    const getRoleBadge = (r = 'employee') => {
        switch (r.toLowerCase()) {
            case 'superadmin':
                return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1"><Shield className="w-3 h-3" /> SuperAdmin</span>
            case 'hr':
                return <span className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1"><Briefcase className="w-3 h-3" /> HR Manager</span>
            case 'admin':
                return <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1"><Shield className="w-3 h-3" /> Admin Lead</span>
            default:
                return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1"><UserCheck className="w-3 h-3" /> Employee</span>
        }
    }

    return (
        <div className="space-y-6 mt-6 animate-fade-in">
            {/* Top Form: Onboard New Staff Account */}
            <div className="glass-panel p-6 rounded-2xl shadow-xl border border-slate-800/80">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500/20 to-blue-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-inner">
                        <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            Onboard Staff Member
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">Admin & HR Management</span>
                        </h2>
                        <p className="text-xs text-slate-400">Register new staff accounts with assigned roles, departments, and custom login credentials</p>
                    </div>
                </div>

                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                    {/* Full Name */}
                    <div className="lg:col-span-3">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                            Full Name *
                        </label>
                        <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            type="text"
                            placeholder="e.g., Vikram Sharma"
                            className="w-full bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm rounded-xl py-2.5 px-3.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium"
                        />
                    </div>

                    {/* Email Address */}
                    <div className="lg:col-span-3">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            Email Address *
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            type="email"
                            placeholder="vikram@company.com"
                            className="w-full bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm rounded-xl py-2.5 px-3.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium"
                        />
                    </div>

                    {/* Password */}
                    <div className="lg:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            type="text"
                            placeholder="123"
                            className="w-full bg-slate-900/80 border border-slate-700/80 text-white text-sm rounded-xl py-2.5 px-3.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium"
                        />
                    </div>

                    {/* Assigned Role */}
                    <div className="lg:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5 text-sky-400" />
                            System Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-slate-900/80 border border-slate-700/80 text-white text-sm rounded-xl py-2.5 px-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium cursor-pointer"
                        >
                            <option value="employee" className="bg-slate-950 text-white">Employee</option>
                            <option value="admin" className="bg-slate-950 text-indigo-400 font-bold">Admin Lead</option>
                            <option value="hr" className="bg-slate-950 text-sky-400 font-bold">HR Manager</option>
                            <option value="superadmin" className="bg-slate-950 text-purple-400 font-bold">SuperAdmin</option>
                        </select>
                    </div>

                    {/* Department */}
                    <div className="lg:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            Department
                        </label>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full bg-slate-900/80 border border-slate-700/80 text-white text-sm rounded-xl py-2.5 px-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium cursor-pointer"
                        >
                            <option value="Engineering" className="bg-slate-950">Engineering</option>
                            <option value="Design" className="bg-slate-950">Design</option>
                            <option value="Human Resources" className="bg-slate-950">Human Resources</option>
                            <option value="Management" className="bg-slate-950">Management</option>
                            <option value="QA & Testing" className="bg-slate-950">QA & Testing</option>
                            <option value="DevOps & Infrastructure" className="bg-slate-950">DevOps</option>
                            <option value="Executive" className="bg-slate-950">Executive</option>
                        </select>
                    </div>

                    {/* Onboard Button */}
                    <div className="lg:col-span-12 mt-2">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-sm py-3 px-6 rounded-xl shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>Create Account & Register Staff Member</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Bottom Table: Staff Directory & Access Control */}
            <div className="glass-panel p-6 rounded-2xl shadow-xl border border-slate-800/80">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight">Staff Account Management</h2>
                            <p className="text-xs text-slate-400">View registered staff accounts, edit passwords, and manage permissions</p>
                        </div>
                    </div>

                    {/* Role Filter & Search */}
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={selectedRoleFilter}
                            onChange={(e) => setSelectedRoleFilter(e.target.value)}
                            className="bg-slate-900/90 border border-slate-700/80 text-white text-xs rounded-xl py-2 px-3 outline-none focus:border-purple-500 transition-all font-medium cursor-pointer"
                        >
                            <option value="all">Filter All Roles ({allStaff.length})</option>
                            <option value="superadmin">SuperAdmins</option>
                            <option value="hr">HR Managers</option>
                            <option value="admin">Admin Leads</option>
                            <option value="employee">Employees</option>
                        </select>

                        <div className="relative w-full sm:w-56">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                type="text"
                                placeholder="Search staff by name/email..."
                                className="w-full bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs rounded-xl py-2 pl-9 pr-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Staff List Rows */}
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {filteredStaff.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 text-sm italic glass-card rounded-xl">
                            No matching staff members found.
                        </div>
                    ) : (
                        filteredStaff.map((staff, idx) => {
                            const initial = (staff.firstName || 'U').charAt(0).toUpperCase()

                            return (
                                <div
                                    key={staff.id || idx}
                                    className="glass-card p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-slate-950 font-extrabold text-base flex items-center justify-center shadow-md shrink-0">
                                            {initial}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-bold text-white">{staff.firstName}</h3>
                                                {getRoleBadge(staff.role)}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                                <span>{staff.email}</span>
                                                <span>•</span>
                                                <span className="text-slate-300 font-semibold">{staff.department || 'Engineering'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                        <button
                                            onClick={() => {
                                                setEditingUser(staff)
                                                setNewPass(staff.password || '123')
                                            }}
                                            className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all"
                                        >
                                            <Key className="w-3.5 h-3.5 text-amber-400" />
                                            <span>Reset Password</span>
                                        </button>

                                        <button
                                            onClick={() => handleDeleteUser(staff.id, staff.firstName)}
                                            className="bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-rose-500/30 transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Reset Password Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl animate-toast">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Key className="w-4 h-4 text-amber-400" /> Reset Password
                            </h3>
                            <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">✕</button>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-2">Set a new password for <span className="text-white font-bold">{editingUser.firstName}</span> ({editingUser.email}):</p>
                            <input
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                type="text"
                                placeholder="New password"
                                className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl p-3 outline-none focus:border-amber-400 font-medium"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleResetPassword(editingUser.id, editingUser.firstName)}
                                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md"
                            >
                                Save Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserManagement

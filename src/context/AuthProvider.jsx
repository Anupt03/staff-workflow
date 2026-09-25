import React, { createContext, useEffect, useState } from 'react'
import { getLocalStorage, setLocalStorage } from '../utils/localStorage'
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    // Helper to format Supabase profiles + tasks into frontend structure
    const formatSupabaseData = (profiles, tasks) => {
        return profiles.map(profile => {
            const userTasks = tasks.filter(t => t.assigned_to === profile.id)
            
            const formattedTasks = userTasks.map(t => ({
                id: t.id,
                taskTitle: t.task_title,
                taskDescription: t.task_description,
                taskDate: t.task_date,
                category: t.category,
                status: t.status,
                active: t.status === 'active',
                newTask: t.status === 'newTask',
                completed: t.status === 'completed',
                failed: t.status === 'failed'
            }))

            const taskCounts = {
                active: formattedTasks.filter(t => t.active).length,
                newTask: formattedTasks.filter(t => t.newTask).length,
                completed: formattedTasks.filter(t => t.completed).length,
                failed: formattedTasks.filter(t => t.failed).length
            }

            return {
                id: profile.id,
                firstName: profile.first_name || profile.firstName,
                email: profile.email,
                password: profile.password || '123',
                role: profile.role || 'employee',
                department: profile.department || 'General',
                taskCounts,
                tasks: formattedTasks
            }
        })
    }

    const fetchSupabaseData = async () => {
        try {
            if (!isSupabaseConfigured || !supabase) {
                return false
            }

            const { data: profiles, error: profileErr } = await supabase
                .from('profiles')
                .select('*')

            if (profileErr) throw profileErr

            const { data: tasks, error: taskErr } = await supabase
                .from('tasks')
                .select('*')

            if (taskErr) throw taskErr

            const formatted = formatSupabaseData(profiles || [], tasks || [])
            setUserData(formatted)
            return true
        } catch (err) {
            console.warn('Supabase fetch failed, falling back to localStorage:', err)
            return false
        }
    }

    const loadData = async () => {
        setLoading(true)
        const success = await fetchSupabaseData()
        if (!success) {
            if (!localStorage.getItem('employees')) {
                setLocalStorage()
            }
            const { employees } = getLocalStorage()
            setUserData(employees)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    // Create a new staff user account
    const createUserAccount = async ({ firstName, email, password = '123', role = 'employee', department = 'General' }) => {
        if (isSupabaseConfigured && supabase) {
            try {
                const { data: created, error } = await supabase
                    .from('profiles')
                    .insert([{
                        first_name: firstName,
                        email: email.toLowerCase().trim(),
                        password: password.trim(),
                        role: role,
                        department: department
                    }])
                    .select()

                if (error) throw error
                await fetchSupabaseData()
                return true
            } catch (err) {
                console.error('Error creating user profile in Supabase:', err)
            }
        }

        // Local state fallback
        const newUser = {
            id: Date.now(),
            firstName,
            email: email.toLowerCase().trim(),
            password,
            role,
            department,
            taskCounts: { active: 0, newTask: 0, completed: 0, failed: 0 },
            tasks: []
        }

        const currentData = [...(userData || []), newUser]
        setUserData(currentData)
        localStorage.setItem('employees', JSON.stringify(currentData))
        return true
    }

    // Update user password
    const updateUserPassword = async (userId, newPassword) => {
        if (isSupabaseConfigured && supabase && typeof userId === 'string' && userId.length > 20) {
            try {
                const { error } = await supabase
                    .from('profiles')
                    .update({ password: newPassword })
                    .eq('id', userId)

                if (error) throw error
                await fetchSupabaseData()
                return true
            } catch (err) {
                console.error('Error updating password in Supabase:', err)
            }
        }

        // Local state update
        if (!userData) return
        const updated = userData.map(user => {
            if (user.id === userId) {
                return { ...user, password: newPassword }
            }
            return user
        })
        setUserData(updated)
        localStorage.setItem('employees', JSON.stringify(updated))
    }

    // Update user role
    const updateUserRole = async (userId, newRole) => {
        if (isSupabaseConfigured && supabase && typeof userId === 'string' && userId.length > 20) {
            try {
                const { error } = await supabase
                    .from('profiles')
                    .update({ role: newRole })
                    .eq('id', userId)

                if (error) throw error
                await fetchSupabaseData()
                return true
            } catch (err) {
                console.error('Error updating role in Supabase:', err)
            }
        }

        // Local state update
        if (!userData) return
        const updated = userData.map(user => {
            if (user.id === userId) {
                return { ...user, role: newRole }
            }
            return user
        })
        setUserData(updated)
        localStorage.setItem('employees', JSON.stringify(updated))
    }

    // Delete user account
    const deleteUserAccount = async (userId) => {
        if (isSupabaseConfigured && supabase && typeof userId === 'string' && userId.length > 20) {
            try {
                const { error } = await supabase
                    .from('profiles')
                    .delete()
                    .eq('id', userId)

                if (error) throw error
                await fetchSupabaseData()
                return true
            } catch (err) {
                console.error('Error deleting profile in Supabase:', err)
            }
        }

        // Local state deletion
        if (!userData) return
        const updated = userData.filter(u => u.id !== userId)
        setUserData(updated)
        localStorage.setItem('employees', JSON.stringify(updated))
    }

    // Create a new task in Supabase (or fallback to state/localStorage)
    const createTask = async ({ taskTitle, taskDescription, taskDate, category, asignTo }) => {
        if (isSupabaseConfigured && supabase) {
            try {
                // Find target employee profile by first_name
                let { data: profiles } = await supabase
                    .from('profiles')
                    .select('*')
                    .ilike('first_name', asignTo.trim())

                let profile = profiles && profiles[0]

                // Create profile if doesn't exist
                if (!profile) {
                    const cleanName = asignTo.trim()
                    const newEmail = `${cleanName.toLowerCase().replace(/\s+/g, '')}@example.com`
                    
                    const { data: createdProfile, error: createErr } = await supabase
                        .from('profiles')
                        .insert([{
                            first_name: cleanName,
                            email: newEmail,
                            password: '123',
                            role: 'employee',
                            department: 'General'
                        }])
                        .select()

                    if (createErr) throw createErr
                    profile = createdProfile[0]
                }

                // Insert Task
                const { error: taskInsertErr } = await supabase
                    .from('tasks')
                    .insert([{
                        assigned_to: profile.id,
                        task_title: taskTitle,
                        task_description: taskDescription,
                        task_date: taskDate,
                        category: category,
                        status: 'newTask'
                    }])

                if (taskInsertErr) throw taskInsertErr

                // Refetch updated data
                await fetchSupabaseData()
                return true
            } catch (err) {
                console.error('Error creating task in Supabase:', err)
            }
        }

        // Fallback for local state / localStorage
        const taskObj = { taskTitle, taskDescription, taskDate, category, active: false, newTask: true, failed: false, completed: false }
        const currentData = [...(userData || [])]
        let employeeFound = false

        currentData.forEach((elem) => {
            if (asignTo.trim().toLowerCase() === elem.firstName.toLowerCase()) {
                elem.tasks.push(taskObj)
                elem.taskCounts.newTask = (elem.taskCounts.newTask || 0) + 1
                employeeFound = true
            }
        })

        if (!employeeFound) {
            const cleanName = asignTo.trim()
            const newEmployee = {
                id: Date.now(),
                firstName: cleanName,
                email: `${cleanName.toLowerCase().replace(/\s+/g, '')}@example.com`,
                password: "123",
                role: 'employee',
                department: 'General',
                taskCounts: { active: 0, newTask: 1, completed: 0, failed: 0 },
                tasks: [taskObj]
            }
            currentData.push(newEmployee)
        }

        setUserData(currentData)
        localStorage.setItem('employees', JSON.stringify(currentData))
    }

    // Update status of a task
    const updateTaskStatus = async (taskId, newStatus, employeeId) => {
        if (isSupabaseConfigured && supabase && taskId && typeof taskId === 'string' && taskId.length > 20) {
            try {
                const { error } = await supabase
                    .from('tasks')
                    .update({ status: newStatus })
                    .eq('id', taskId)

                if (error) throw error
                await fetchSupabaseData()
                return true
            } catch (err) {
                console.error('Error updating task status in Supabase:', err)
            }
        }

        // Local state fallback update
        if (!userData) return
        const updated = userData.map(emp => {
            if (emp.id === employeeId || emp.tasks.some(t => t.id === taskId || t.taskTitle === taskId)) {
                const updatedTasks = emp.tasks.map(t => {
                    if (t.id === taskId || t.taskTitle === taskId) {
                        return {
                            ...t,
                            status: newStatus,
                            active: newStatus === 'active',
                            newTask: newStatus === 'newTask',
                            completed: newStatus === 'completed',
                            failed: newStatus === 'failed'
                        }
                    }
                    return t
                })

                const taskCounts = {
                    active: updatedTasks.filter(t => t.active).length,
                    newTask: updatedTasks.filter(t => t.newTask).length,
                    completed: updatedTasks.filter(t => t.completed).length,
                    failed: updatedTasks.filter(t => t.failed).length
                }

                return { ...emp, tasks: updatedTasks, taskCounts }
            }
            return emp
        })

        setUserData(updated)
        localStorage.setItem('employees', JSON.stringify(updated))
    }

    return (
        <AuthContext.Provider value={[
            userData, 
            setUserData, 
            { 
                createTask, 
                updateTaskStatus, 
                createUserAccount, 
                updateUserPassword, 
                updateUserRole,
                deleteUserAccount, 
                refreshData: loadData 
            }
        ]}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
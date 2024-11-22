'use client'

import { useEffect, useState } from 'react'
import { User } from '../types/user'
import { UserCard } from '../components/UserCard'
import { EditModal } from '../components/EditModal'
import { DarkModeToggle } from '../components/DarkModeToggle'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    // Check system preference or saved preference
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDark)
    
    // Apply dark mode class to html element
    if (isDark) {
      document.documentElement.classList.add('dark')
    }

    const fetchUsers = async () => {
      try {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000))
        const mockUsers = [
          { id: "1", name: "John Doe", email: "john@example.com" },
          { id: "2", name: "Jane Smith", email: "jane@example.com" },
          { id: "3", name: "Bob Johnson", email: "bob@example.com" },
          { id: "4", name: "Alice Brown", email: "alice@example.com" },
          { id: "5", name: "Charlie Wilson", email: "charlie@example.com" }
        ]
        setUsers(mockUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    // Add event listener for tab key when modal is open
    const handleTabKey = (e: KeyboardEvent) => {
      if (isModelOpen && e.key === 'Tab') {
        e.preventDefault()
      }
    }

    if (isModelOpen) {
      window.addEventListener('keydown', handleTabKey)
    }

    return () => {
      window.removeEventListener('keydown', handleTabKey)
    }
  }, [isModelOpen])

  useEffect(() => {
    // Add click event listener to handle outside clicks
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside of dropdown menu
      if (!target.closest('[data-dropdown-menu]')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array since we only want to set up the listener once

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    localStorage.setItem('darkMode', (!darkMode).toString())
    document.documentElement.classList.toggle('dark')
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsModelOpen(true)
    setActiveDropdown(null)
  }

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId))
      setActiveDropdown(null)
    }
  }

  const handleSave = (updatedUser: User) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ))
    setIsModelOpen(false)
    setEditingUser(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
      </div>
      

      {/* Page Title */}
      <div className="bg-gradient-to-b from-white dark:from-gray-800 to-gray-50 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            User Management
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12">
            You can manage your team members here, (update, delete).
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl overflow-hidden">
          {/* Users Summary */}
          <div className="flex justify-center gap-4 p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-semibold dark:text-white">{users.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
            </div>
          </div>

          {/* User Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>

      {isModelOpen && (
        <EditModal
          editingUser={editingUser || undefined}
          onSave={handleSave}
          onClose={() => setIsModelOpen(false)}
          aria-modal="true"
        />
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { User } from '../types/user'
import { UserCard } from '../components/UserCard'
import { EditModel } from '../components/EditModel'
import { DarkModeToggle } from '../components/DarkModeToggle'
import { AddUserButton } from '../components/AddUserButton'

interface ApiResponse {
  code: number;
  message: string;
  data: Array<{
    userId: string;
    userName: string;
    userEmail: string;
  }>;
}

// Add mock configuration
const MOCK_USERS: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com' },
]

const IS_MOCK_ENABLED = process.env.NEXT_PUBLIC_USE_MOCK === 'true'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

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
        if (IS_MOCK_ENABLED) {
          setUsers(MOCK_USERS)
          return
        }

        const response = await fetch(`${API_BASE_URL}/users/list`);
        const result: ApiResponse = await response.json();
        console.log(result);
        if (result.code === 0) {
          // Transform API users to match our User interface
          const transformedUsers: User[] = result.data.map((apiUser: { userId: any; userName: any; userEmail: any }) => ({
            id: apiUser.userId,
            name: apiUser.userName,
            email: apiUser.userEmail
          }));
          
          setUsers(transformedUsers);
        } else {
          console.error('Error fetching users:', result.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
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
      try {
        if (IS_MOCK_ENABLED) {
          setUsers(users.filter(user => user.id !== userId))
        } else {
          const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
          });
          
          const result = await response.json();
          if (result.code === 0) {
            setUsers(users.filter(user => user.id !== userId))
          } else {
            console.error('Error deleting user:', result.message);
          }
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
      setActiveDropdown(null)
    }
  }

  const handleSave = async (updatedUser: User) => {
    try {
      if (IS_MOCK_ENABLED) {
        setUsers(users.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        ))
      } else {
        const response = await fetch(`${API_BASE_URL}/users/${updatedUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: updatedUser.name,
            userEmail: updatedUser.email
          })
        });

        const result = await response.json();
        if (result.code === 0) {
          setUsers(users.map(user => 
            user.id === updatedUser.id ? updatedUser : user
          ))
        } else {
          console.error('Error updating user:', result.message);
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
    
    setIsModelOpen(false);
    setEditingUser(null);
  }

  const handleCreate = async (newUser: Omit<User, 'id'>) => {
    try {
      if (IS_MOCK_ENABLED) {
        const mockUser: User = {
          id: (users.length + 1).toString(),
          name: newUser.name,
          email: newUser.email
        };
        setUsers([...users, mockUser]);
      } else {
        const response = await fetch(`${API_BASE_URL}/users/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: newUser.name,
            userEmail: newUser.email
          })
        });

        const result = await response.json();
        if (result.code === 0) {
          // Refresh user list after successful creation
          const fetchResponse = await fetch(`${API_BASE_URL}/users/list`);
          const fetchResult: ApiResponse = await fetchResponse.json();
          if (fetchResult.code === 0) {
            const transformedUsers: User[] = fetchResult.data.map(apiUser => ({
              id: apiUser.userId,
              name: apiUser.userName,
              email: apiUser.userEmail
            }));
            setUsers(transformedUsers);
          }
        } else {
          console.error('Error creating user:', result.message);
        }
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
    setIsModelOpen(false);
    setEditingUser(null);
  }

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModelOpen(true);
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
              <p className="text-2xl font-semibold text-gray-600 dark:text-gray-300">{users.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
            </div>
          </div>

          {/* User Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {loading ? (
              <div className="col-span-2 text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No users found</p>
              </div>
            ) : (
              users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <AddUserButton onClick={handleAddUser} />

      {isModelOpen && (
        <EditModel
          editingUser={editingUser || undefined}
          onSave={(user) => {
            if (editingUser) {
              handleSave(user as User);
            } else {
              handleCreate(user);
            }
          }}
          onClose={() => setIsModelOpen(false)}
          isCreating={!editingUser}
        />
      )}
    </div>
  )
}

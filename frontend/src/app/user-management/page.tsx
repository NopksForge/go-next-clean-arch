'use client'

import { useEffect, useState } from 'react'
import { User } from '../types/user'
import { UserCard } from '../components/UserCard'
import { EditModel } from '../components/EditModel'
import { DarkModeToggle } from '../components/DarkModeToggle'
import { AddUserButton } from '../components/AddUserButton'
import { RefreshButton } from '../components/RefreshButton'


interface ApiResponse {
  code: number;
  message: string;
  data: Array<{
    userId: string;
    userEmail: string;
    userFirstName: string;
    userLastName: string;
    userPhone: string;
    userRole: string;
    userUpdatedAt: string;
    isActive: boolean;
  }>;
}

// Add mock configuration
const MOCK_USERS: User[] = [
  { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe', phone: '0812345678', role: 'Back End', updatedAt: '2024-11-26T01:56:44.345322Z', isActive: true },
  { id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', email: 'jane.smith@example.com', firstName: 'Jane', lastName: 'Smith', phone: '0823456789', role: 'Front End', updatedAt: '2024-11-26T01:56:44.345322Z', isActive: true },
  { id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', email: 'bob.wilson@example.com', firstName: 'Bob', lastName: 'Wilson', phone: '0834567890', role: 'Full Stack', updatedAt: '2024-11-26T01:56:44.345322Z', isActive: true },
  { id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', email: 'sarah.jones@example.com', firstName: 'Sarah', lastName: 'Jones', phone: '0845678901', role: 'Front End', updatedAt: '2024-11-26T01:56:44.345322Z', isActive: true },
  { id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', email: 'mike.brown@example.com', firstName: 'Mike', lastName: 'Brown', phone: '0856789012', role: 'Full Stack', updatedAt: '2024-11-26T01:56:44.345322Z', isActive: true },
  { id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', email: 'lisa.taylor@example.com', firstName: 'Lisa', lastName: 'Taylor', phone: '0867890123', role: 'Full Stack', updatedAt: '2024-11-26T01:56:44.345322Z', isActive: true },
  { id: 'a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', email: 'david.miller@example.com', firstName: 'David', lastName: 'Miller', phone: '0878901234', role: 'BU', updatedAt: '2024-11-26T01:56:44.345322Z', isActive: true },
  { id: 'b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', email: 'emma.davis@example.com', firstName: 'Emma', lastName: 'Davis', phone: '0889012345', role: 'BA', updatedAt: '2024-11-26T01:56:44.345322Z', isActive: true },
  { id: 'c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', email: 'tom.white@example.com', firstName: 'Tom', lastName: 'White', phone: '0890123456', role: 'BA', updatedAt: '2024-11-26T01:56:44.345322Z', isActive: true },
  { id: 'd9eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', email: 'amy.garcia@example.com', firstName: 'Amy', lastName: 'Garcia', phone: '0801234567', role: 'Full Stack', updatedAt: '2024-11-26T01:56:44.345322Z', isActive: false },
  { id: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', email: 'peter.wang@example.com', firstName: 'Peter', lastName: 'Wang', phone: '0812345670', role: 'Tester', updatedAt: '2024-11-26T01:56:44.345322Z', isActive: true },
  { id: 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', email: 'mary.chen@example.com', firstName: 'Mary', lastName: 'Chen', phone: '0823456701', role: 'Tester', updatedAt: '2024-11-26T01:56:44.345322Z', isActive: true },
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
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('')

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (IS_MOCK_ENABLED) {
        setUsers(MOCK_USERS);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/list`);
      const result: ApiResponse = await response.json();
      if (result.code === 0) {
        const transformedUsers: User[] = result.data.map((apiUser) => ({
          id: apiUser.userId,
          email: apiUser.userEmail,
          firstName: apiUser.userFirstName,
          lastName: apiUser.userLastName,
          phone: apiUser.userPhone,
          role: apiUser.userRole,
          updatedAt: apiUser.userUpdatedAt || new Date().toISOString(),
          isActive: apiUser.isActive
        }));
        setUsers(transformedUsers);
      } else {
        console.error('Error fetching users:', result.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      setLastUpdateTime(`${hours}:${minutes}`)
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get saved preference from localStorage first
    const savedDarkMode = localStorage.getItem('darkMode')
    
    // If there's a saved preference, use it
    if (savedDarkMode !== null) {
      const isDark = savedDarkMode === 'true'
      setDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      // If no saved preference, check system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(isDark)
      localStorage.setItem('darkMode', isDark.toString())
      if (isDark) {
        document.documentElement.classList.add('dark')
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
            userFirstName: updatedUser.firstName,
            userLastName: updatedUser.lastName,
            userPhone: updatedUser.phone,
            userRole: updatedUser.role,
            userEmail: updatedUser.email,
            isActive: updatedUser.isActive
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
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone,
          role: newUser.role,
          email: newUser.email,
          updatedAt: new Date().toISOString(),
          isActive: newUser.isActive,
        };
        setUsers([...users, mockUser]);
      } else {
        const response = await fetch(`${API_BASE_URL}/users/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userFirstName: newUser.firstName,
            userLastName: newUser.lastName,
            userPhone: newUser.phone,
            userRole: newUser.role,
            userEmail: newUser.email,
            isActive: newUser.isActive
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
              firstName: apiUser.userFirstName,
              lastName: apiUser.userLastName,
              phone: apiUser.userPhone,
              role: apiUser.userRole,
              email: apiUser.userEmail,
              updatedAt: apiUser.userUpdatedAt || new Date().toISOString(),
              isActive: apiUser.isActive
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
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        <RefreshButton onRefresh={fetchUsers} isLoading={loading} />
        <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
      </div>
      

      {/* Page Title */}
      <div className="bg-gradient-to-b from-white dark:from-gray-800 to-gray-200 dark:to-gray-900">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 
            bg-clip-text text-transparent 
            bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500
            dark:from-purple-300 dark:via-pink-300 dark:to-indigo-300
            tracking-tight leading-normal py-2
            drop-shadow-[0_0_15px_rgba(168,85,247,0.2)]
            transition-all duration-300 hover:scale-[1.02]">
            User Management
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12">
            You can manage your team members here, (add,update, delete).
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl overflow-hidden">
          {/* Users Summary */}
          <div className="flex justify-around gap-4 p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-600 dark:text-gray-300">{users.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
            </div>
            {lastUpdateTime && (
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-600 dark:text-gray-300">{lastUpdateTime}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last updated</p>
              </div>
            )}
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
              handleCreate(user as Omit<User, 'id'>);
            }
          }}
          onClose={() => setIsModelOpen(false)}
          isCreating={!editingUser}
        />
      )}
    </div>
  )
}

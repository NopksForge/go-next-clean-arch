import { User } from '../types/user'

interface UserCardProps {
  user: User
  activeDropdown: string | null
  setActiveDropdown: (id: string | null) => void
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
}

export function UserCard({ user, activeDropdown, setActiveDropdown, onEdit, onDelete }: UserCardProps) {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-gray-600 dark:text-gray-300">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        
        <div data-dropdown-menu className="relative">
          <button
            onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {activeDropdown === user.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-100 dark:border-gray-700">
              <button
                onClick={() => onEdit(user)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(user.id)}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
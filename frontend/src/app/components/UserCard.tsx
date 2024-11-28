import { User } from '../types/user'

interface UserCardProps {
  user: User
  activeDropdown: string | null
  setActiveDropdown: (id: string | null) => void
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day} ${month} ${year} ${hours}:${minutes}`;
}

export function UserCard({ user, activeDropdown, setActiveDropdown, onEdit, onDelete }: UserCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveDropdown(null)
    onEdit(user)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveDropdown(null)
    onDelete(user.id)
  }

  const formattedDate = user.updatedAt 
    ? formatDate(user.updatedAt)
    : 'No date available';

  const getStatusColor = (isActive: boolean) => {
    if (isActive) {
      return 'bg-green-500';
    } else {
      return 'bg-red-500';
    }
  }

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl p-8 mb-4 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col space-y-6">
        {/* Profile Section */}
        <div className="flex items-center space-x-5">
          <div className="relative">
            <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center ring-1 ring-gray-100 dark:ring-gray-700">
              <span className="text-xl font-medium text-gray-900 dark:text-gray-100">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
            <div className={`absolute bottom-0 right-0 w-4 h-4 ${getStatusColor(user.isActive)} border-2 border-white dark:border-gray-900 rounded-full`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
          </div>
          
          {/* Actions Menu */}
          <div className="relative" data-dropdown-menu>
            <button
              onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {activeDropdown === user.id && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg z-10 border border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={handleEditClick}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="block w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="flex flex-row justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Email: </span>
            <span className="text-gray-900 dark:text-gray-100">{user.email}</span>
          </p>
          <p className="flex flex-row justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Phone: </span>
            <span className="text-gray-900 dark:text-gray-100">{user.phone}</span>
          </p>
          <p className="flex flex-row justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Last updated: </span>
            <span className="text-gray-900 dark:text-gray-100">
              {formattedDate}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
} 
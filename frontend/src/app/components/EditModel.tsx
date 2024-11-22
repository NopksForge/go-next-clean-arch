import React, { useState, useEffect } from 'react'

interface EditModalProps {
  editingUser?: { id: string; name: string; email: string }
  onSave: (user: { id?: string; name: string; email: string }) => void
  onClose: () => void
  isCreating?: boolean
}

export function EditModel({ editingUser, onSave, onClose, isCreating }: EditModalProps) {
  const [formData, setFormData] = useState(editingUser || { id: '', name: '', email: '' })
  const [errors, setErrors] = useState({ name: '', email: '' })

  useEffect(() => {
    if (editingUser) {
      setFormData(editingUser)
    }
  }, [editingUser])

  const validateForm = () => {
    const newErrors = { name: '', email: '' }
    let isValid = true

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
      isValid = false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all">
        <h2 className="text-2xl font-bold mb-6 dark:text-white text-center">
          {isCreating ? '➕ Add New User' : '✏️ Edit User Details'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  if (errors.name) setErrors({ ...errors, name: '' })
                }}
                className={`mt-1 block w-full rounded-lg border px-4 py-3 
                          transition duration-150 ease-in-out
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30
                          dark:bg-gray-700 dark:text-white
                          ${errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                placeholder="Enter name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  if (errors.email) setErrors({ ...errors, email: '' })
                }}
                className={`mt-1 block w-full rounded-lg border px-4 py-3
                          transition duration-150 ease-in-out
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30
                          dark:bg-gray-700 dark:text-white
                          ${errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                placeholder="Enter email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium rounded-lg border border-gray-200
                        transition duration-150 ease-in-out
                        hover:bg-gray-50 hover:border-gray-300
                        dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg
                        transition duration-150 ease-in-out
                        hover:bg-blue-700 hover:shadow-lg
                        focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {isCreating ? 'Add User' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 
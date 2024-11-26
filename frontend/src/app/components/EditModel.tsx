import React, { useState, useEffect } from 'react'

interface EditModalProps {
  editingUser?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    updatedAt: string
    isActive: boolean
  }
  onSave: (user: {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    updatedAt?: string
    isActive: boolean
  }) => void
  onClose: () => void
  isCreating?: boolean
}

export function EditModel({ editingUser, onSave, onClose, isCreating }: EditModalProps) {
  const [formData, setFormData] = useState({
    id: editingUser?.id || '',
    firstName: editingUser?.firstName || '',
    lastName: editingUser?.lastName || '',
    email: editingUser?.email || '',
    phone: editingUser?.phone || '',
    role: editingUser?.role || '',
    updatedAt: editingUser?.updatedAt || '',
    isActive: editingUser?.isActive ?? true
  })
  const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '', phone: '', role: '' })

  useEffect(() => {
    if (editingUser) {
      setFormData({
        ...editingUser,
        isActive: editingUser.isActive ?? true
      })
    }
  }, [editingUser])

  const validateForm = () => {
    const newErrors = { firstName: '', lastName: '', email: '', phone: '', role: '' }
    let isValid = true

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
      isValid = false
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
      isValid = false
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
      isValid = false
    }
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required'
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
        <h2 className="text-2xl font-bold mb-6 text-gray-600 dark:text-gray-300 text-center">
          {isCreating ? '➕ Add New User' : '✏️ Edit User Details'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value })
                  if (errors.firstName) setErrors({ ...errors, firstName: '' })
                }}
                className={`mt-1 block w-full rounded-lg border px-4 py-3 
                          transition duration-150 ease-in-out
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30
                          dark:bg-gray-700 text-gray-600 dark:text-gray-300
                          ${errors.firstName ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                placeholder="Enter first name"
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value })
                  if (errors.lastName) setErrors({ ...errors, lastName: '' })
                }}
                className={`mt-1 block w-full rounded-lg border px-4 py-3 
                          transition duration-150 ease-in-out
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30
                          dark:bg-gray-700 text-gray-600 dark:text-gray-300
                          ${errors.lastName ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                placeholder="Enter last name"
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
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
                          dark:bg-gray-700 text-gray-600 dark:text-gray-300
                          ${errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                placeholder="Enter email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value })
                  if (errors.phone) setErrors({ ...errors, phone: '' })
                }}
                className={`mt-1 block w-full rounded-lg border px-4 py-3 
                          transition duration-150 ease-in-out
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30
                          dark:bg-gray-700 text-gray-600 dark:text-gray-300
                          ${errors.phone ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => {
                  setFormData({ ...formData, role: e.target.value })
                  if (errors.role) setErrors({ ...errors, role: '' })
                }}
                className={`mt-1 block w-full rounded-lg border px-4 py-3 
                          transition duration-150 ease-in-out
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30
                          dark:bg-gray-700 text-gray-600 dark:text-gray-300
                          ${errors.role ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
              >
                <option value="">Select a role</option>
                <option value="Back End">Back End</option>
                <option value="Front End">Front End</option>
                <option value="Full Stack">Full Stack</option>
                <option value="BA">BA</option>
                <option value="BU">BU</option>
                <option value="Tester">Tester</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Active User</span>
              </label>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium rounded-lg border border-gray-200
                        transition duration-150 ease-in-out
                        hover:bg-gray-50 hover:border-gray-300
                        dark:border-gray-600 text-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
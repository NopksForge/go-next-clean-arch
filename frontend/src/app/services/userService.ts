import { User } from '../types/user'
import { ApiResponse } from '../types/user'

const IS_MOCK_ENABLED = process.env.NEXT_PUBLIC_USE_MOCK === 'true'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Mock data
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

const transformApiUsers = (apiUsers: ApiResponse['data']): User[] => {
  return apiUsers.map((apiUser) => ({
    id: apiUser.userId,
    email: apiUser.userEmail,
    firstName: apiUser.userFirstName,
    lastName: apiUser.userLastName,
    phone: apiUser.userPhone,
    role: apiUser.userRole,
    updatedAt: apiUser.updatedAt,
    isActive: apiUser.isActive
  }));
};

export const userService = {
  fetchUsers: async (): Promise<User[]> => {
    if (IS_MOCK_ENABLED) {
      return MOCK_USERS;
    }

    const response = await fetch(`${API_BASE_URL}/users/list`);
    const result: ApiResponse = await response.json();
    if (result.code === 0) {
      return transformApiUsers(result.data);
    }
    throw new Error(result.message);
  },

  deleteUser: async (userId: string): Promise<boolean> => {
    if (IS_MOCK_ENABLED) {
      return true;
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    return result.code === 0;
  },

  updateUser: async (updatedUser: User): Promise<boolean> => {
    if (IS_MOCK_ENABLED) {
      return true;
    }

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
    return result.code === 0;
  },

  createUser: async (newUser: Omit<User, 'id'>): Promise<boolean> => {
    if (IS_MOCK_ENABLED) {
      return true;
    }

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
    return result.code === 0;
  }
}; 
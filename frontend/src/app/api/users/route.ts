import { NextResponse } from 'next/server'

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com"
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com"
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com"
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com"
  }
]

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return NextResponse.json(mockUsers)
} 
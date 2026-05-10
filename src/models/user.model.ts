export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  membershipType: string
}

const users: User[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', membershipType: 'silver' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', membershipType: 'gold' },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', membershipType: 'platinum' },
  { id: 4, firstName: 'Alice', lastName: 'Williams', email: 'alice.williams@example.com', membershipType: 'silver' },
  { id: 5, firstName: 'David', lastName: 'Brown', email: 'david.brown@example.com', membershipType: 'Platinum' }
]

export const getAll = (): User[] => {
  return users
}

export const getById = (id: number): User | undefined => {
  return users.find(user => user.id === id)
}

export const create = (user: Omit<User, 'id'>): User => {
  const newUser: User = {
    id: users.length + 1,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    membershipType: user.membershipType,
  }
  users.push(newUser)
  return newUser
}

export const update = (id: number, updatedUser: Omit<User, 'id'>): boolean => {
  const index = users.findIndex(user => user.id === id)
  if (index === -1) return false
  users[index] = { ...users[index], ...updatedUser }
  return true
}

export const remove = (id: number): boolean => {
  const index = users.findIndex(user => user.id === id)
  if (index === -1) return false
  users.splice(index, 1)
  return true
}

export const calculateDiscount = (membershipType: string, amount: number) => {
  const type = membershipType.toLowerCase()
  let discountPercentage = 0
  if (type === 'silver') discountPercentage = 0.05
  else if (type === 'gold') discountPercentage = 0.10
  else if (type === 'platinum') discountPercentage = 0.15

  const discountAmount = amount * discountPercentage
  const finalTotal = amount - discountAmount
  return { discountPercentage, finalTotal }
}

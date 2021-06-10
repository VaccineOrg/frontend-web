export type User = {
  email: string,
  employeeId: string,
  id: number,
  password: string,
  userName: string
}

export type UserData = Omit<User, "id" | "employeeId">

export type UserLogin = Omit<User, "id" | "employeeId" | "userName">

export type UserCache = Omit<User, "employeeId" | "password">

import { UserCache, UserLogin } from "./User";

export type AuthContextType = {
  isAuthenticated: boolean,
  user: UserCache | null,
  signIn: (data: UserLogin) => Promise<void>
  signOut: () => void
}

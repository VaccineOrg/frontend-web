import { createContext, useEffect, useState } from "react";

import { useRouter } from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";

import { showErrorMessage } from "../components/Toast";

import AuthService from "../services/AuthService";
import UserService from "../services/UserService";

import { AuthContextType } from "../types/Auth";
import { UserCache, UserLogin } from "../types/User";

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: any) {
  const router = useRouter()

  const [user, setUser] = useState<UserCache | null>(null)

  const authService = new AuthService()
  const userService = new UserService()

  const isAuthenticated = !!user

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()

    if (token) {
      const [userProfile, id] = token.split(".")

      userService.setUserProfileHeader(userProfile)
      authService.setUserProfileHeader(userProfile)

      userService.getUser(parseInt(id))
        .then(response => setUser(response.data))
        .catch(err => showErrorMessage(err.response.data.description))
    }
  }, [])

  async function signIn({ email, password }: UserLogin) {
    authService.loginUser({ email, password })
      .then(response => {
        const { email, employeeId, id, userName } = response.data

        const [userProfile,] = employeeId?.split("-")

        const token = `${userProfile}.${id}`

        setCookie(undefined, "nextauth.token", token, { maxAge: 60 * 60 * 1 })

        setUser({ email, id, userName })

        router.replace('/consulta')
      })
      .catch(err => showErrorMessage(err.response.data.description))
  }

  function signOut() {
    destroyCookie(undefined, "nextauth.token")

    setUser(null)

    router.replace('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

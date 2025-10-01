import { useEffect, useState } from "react"

export interface AppUser {
  name?: string
  email?: string
  role?: string
  avatar?: string
}

const DEFAULT_USER: AppUser = {
  name: "Yash Jain",
  email: "yash@ninjamap.com",
  role: "Super Admin",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
}

export function getStoredUser(): AppUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem("profile") || window.localStorage.getItem("currentUser")
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

export function saveStoredUser(user: AppUser) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem("profile", JSON.stringify(user))
  } catch (e) {}
}

export function useCurrentUser() {
  const [user, setUser] = useState<AppUser>(() => getStoredUser() || DEFAULT_USER)

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "profile" || e.key === "currentUser") {
        setUser(getStoredUser() || DEFAULT_USER)
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  return {
    user,
    setUser,
    save: (u: AppUser) => {
      saveStoredUser(u)
      setUser(u)
    },
  }
}

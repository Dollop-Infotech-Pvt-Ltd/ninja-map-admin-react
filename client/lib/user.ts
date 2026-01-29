import { useEffect, useState } from "react"
import { api } from "./http"
import type { AdminUser } from "../../shared/api"

export interface AppUser {
  name?: string
  email?: string
  role?: string
  avatar?: string
  firstName?: string
  lastName?: string
  mobileNumber?: string
  employeeId?: string
  bio?: string
  isActive?: boolean
  joiningDate?: string
  id?: string
}

const DEFAULT_USER: AppUser = {
  name: "Yash Jain",
  email: "yash@ninjamap.com",
  role: "Super Admin",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
}

export async function fetchLoggedInUser(): Promise<AdminUser | null> {
  try {
    const response = await api.get<AdminUser>("/api/admins/get-loggedIn-user")
    return response
  } catch (error) {
    console.error("Failed to fetch logged-in user:", error)
    return null
  }
}

export interface UpdateProfileData {
  id: string
  firstName: string
  lastName: string
  profilePicture?: File | string
  gender?: string
  bio?: string
}

export interface ChangePasswordData {
  oldPassword: string
  newPassword: string
}

export async function updateAdminProfile(data: UpdateProfileData): Promise<AdminUser | null> {
  try {
    const formData = new FormData()
    
    formData.append('id', data.id)
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    
    if (data.profilePicture instanceof File) {
      formData.append('profilePicture', data.profilePicture)
    }
    
    if (data.gender) {
      formData.append('gender', data.gender)
    }
    
    if (data.bio) {
      formData.append('bio', data.bio)
    }

    const response = await api.put<AdminUser>("/api/admins/update-admin-profile", {
      body: formData
    })
    
    return response
  } catch (error) {
    console.error("Failed to update admin profile:", error)
    throw error
  }
}

export async function changeAdminPassword(data: ChangePasswordData): Promise<boolean> {
  try {
    const response = await api.post("/api/admins/change-password", {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    return true
  } catch (error) {
    console.error("Failed to change password:", error)
    throw error
  }
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
    // Trigger storage event to update all components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'profile',
      newValue: JSON.stringify(user),
      storageArea: window.localStorage
    }))
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

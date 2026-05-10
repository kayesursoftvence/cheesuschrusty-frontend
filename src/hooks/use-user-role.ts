import { useState, useEffect } from "react";

// Define the possible roles
export type UserRole = "admin" | "user" | "freeUser";

// Define the return type of the hook
interface UseUserRoleReturn {
  role: UserRole;
  isAdmin: boolean;
  isUser: boolean;
  isFreeUser: boolean;
  setRole: (role: UserRole) => void;
}

export const useUserRole = (initialRole: UserRole = "freeUser"): UseUserRoleReturn => {
  const [role, setRole] = useState<UserRole>(initialRole);

  // Optional: fetch role from API/localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return {
    role,
    isAdmin: role === "admin",
    isUser: role === "user",
    isFreeUser: role === "freeUser",
    setRole,
  };
};

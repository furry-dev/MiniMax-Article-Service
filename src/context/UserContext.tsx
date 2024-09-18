"use client"

import {createContext, ReactNode, useContext} from "react"
import {UserEntityWithId} from "@/utils/UserManager/User.interfaces"

export interface UserContextEntity extends Omit<UserEntityWithId, "password" | "id"> {
    uid: string
}

const UserContext = createContext<UserContextEntity | null>(null)

export const useUser = (): UserContextEntity | null => useContext(UserContext)

interface UserProviderProps {
    user: UserContextEntity | null;
    children: ReactNode;
}

export const UserProvider = ({user, children}: UserProviderProps) => (
    <UserContext.Provider value={user}>{children}</UserContext.Provider>
)
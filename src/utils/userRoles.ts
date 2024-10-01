import {UserContextEntity} from "@/context/UserContext"

export function userIsConsultant(user: UserContextEntity | null): boolean {
    const role = user?.role
    return role === "consultant" || role === "admin" || role === "developer"
}

export function userIsCashbox(user: UserContextEntity | null): boolean {
    const role = user?.role
    return role === "cashbox" || role === "admin" || role === "developer"
}

export function userIsWholesale(user: UserContextEntity | null): boolean {
    const role = user?.role
    return role === "wholesale" || role === "admin" || role === "developer"
}

export function userIsLabeler(user: UserContextEntity | null): boolean {
    const role = user?.role
    return role === "labeler" || role === "admin" || role === "developer"
}

export function userIsAdmin(user: UserContextEntity | null): boolean {
    const role = user?.role
    return role === "admin" || role === "developer"
}

export function userIsDeveloper(user: UserContextEntity | null): boolean {
    const role = user?.role
    return role === "developer"
}

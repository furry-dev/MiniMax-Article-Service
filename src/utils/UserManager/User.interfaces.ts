export type UserRole = "cashbox" | "consultant" | "admin" | "labeler" | "developer"

export function isUserRole(role: string): role is UserRole {
    const validRoles: UserRole[] = ["cashbox", "consultant", "admin", "labeler", "developer"]
    return validRoles.includes(role as UserRole)
}

export interface UserEntity {
    avatar?: string
    name: string
    password: string
    role: UserRole
}

export interface UserEntityWithId extends UserEntity {
    id: string
}

export const USER_ROLES_DICT: { [key in UserRole]: string } = {
    cashbox: "Каса",
    consultant: "Консультант",
    admin: "Адмін",
    labeler: "Лейбелер",
    developer: "Розробник"
}

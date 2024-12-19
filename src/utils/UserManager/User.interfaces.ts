export type UserRole =
    "cashbox"
    | "wholesale"
    | "consultant"
    | "wholesaleConsultant"
    | "admin"
    | "labeler"
    | "developer"

export function isUserRole(role: string): role is UserRole {
    const validRoles: UserRole[] = ["cashbox", "wholesale", "consultant", "wholesaleConsultant", "admin", "labeler", "developer"]
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
    wholesale: "Каса(опт)",
    consultant: "Консультант",
    wholesaleConsultant: "Консультант(опт)",
    admin: "Адмін",
    labeler: "Лейбелер",
    developer: "Розробник"
}

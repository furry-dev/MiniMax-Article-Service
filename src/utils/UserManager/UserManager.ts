"use server"

import {addDoc, collection, doc, getDoc, getDocs, updateDoc} from "@firebase/firestore"
import {db2} from "@/db/firebase.config"
import {isUserRole, UserEntity, UserEntityWithId} from "@/utils/UserManager/User.interfaces"
import bcrypt from "bcrypt"
import fs from "node:fs/promises"


export async function GetUsers() {
    try {
        const docsSnap = await getDocs(collection(db2, "users"))

        const users: UserEntityWithId[] = []

        docsSnap.forEach(doc => users.push({
            ...doc.data() as UserEntity,
            id: doc.id
        }))

        return users
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function GetUser(userId: string) {
    try {
        const docSnap = await getDoc(doc(db2, "users", userId))

        if (docSnap.exists()) {
            return {
                ...docSnap.data(),
                id: docSnap.id
            } as UserEntityWithId
        } else {
            return undefined
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

interface UserCreateDto extends Omit<UserEntity, "avatar"> {
    avatar?: File
}

function parseFormDataToUserCreateDto(formData: FormData): UserCreateDto {
    const name = formData.get("name") as string | null
    const password = formData.get("password") as string | null
    const role = formData.get("role") as string | null
    const avatar = formData.get("avatar") as File | undefined

    if (!name || !password || !role) {
        throw new Error("Missing required fields: name, password, or role.")
    }

    if (!isUserRole(role)) {
        throw new Error("Invalid role value.")
    }

    return {
        name,
        password,
        role,
        avatar: avatar || undefined,
    }
}

export async function CreateUser(formData: FormData) {
    try {
        const createUserDto = parseFormDataToUserCreateDto(formData)

        createUserDto.password = await hashPassword(createUserDto.password)

        let filename: null | string = null

        if (createUserDto.avatar) {
            const arrayBuffer = await createUserDto.avatar.arrayBuffer()
            const buffer = new Uint8Array(arrayBuffer)

            const fileExtension = createUserDto.avatar.name.split(".").pop()
            filename = `avatar_${new Date().toISOString().replace(/[-:.]/g, "")}.${fileExtension}`

            await fs.writeFile(`./public/images/avatars/${filename}`, buffer)
        }

        const data = {
            ...createUserDto,
            avatar: filename
        }

        const docRef = await addDoc(collection(db2, "users"), data)

        return {userId: docRef.id}
    } catch (error) {
        console.error(error)
        throw error
    }
}

interface UserUpdateDto extends Omit<UserEntityWithId, "avatar" | "password"> {
    password: string | null
    avatar?: File
}

function parseFormDataToUserUpdateDto(formData: FormData): UserUpdateDto {
    const id = formData.get("id") as string | null
    const name = formData.get("name") as string | null
    const password = formData.get("password") as string | null
    const role = formData.get("role") as string | null
    const avatar = formData.get("avatar") as File | undefined

    if (!id || !name || !role) {
        throw new Error("Missing required fields: name, password, or role.")
    }

    if (!isUserRole(role)) {
        throw new Error("Invalid role value.")
    }

    return {
        id,
        name,
        password,
        role,
        avatar: avatar || undefined,
    }
}

export async function UpdateUser(formData: FormData) {
    try {
        const updateUserDto = parseFormDataToUserUpdateDto(formData)

        const userDocRef = doc(db2, "users", updateUserDto.id)
        const userDocSnap = await getDoc(userDocRef)

        if (!userDocSnap.exists()) return false

        const existingUserData = await GetUser(updateUserDto.id)
        if (!existingUserData) return false

        if (updateUserDto.password) {
            updateUserDto.password = await hashPassword(updateUserDto.password)
        } else {
            updateUserDto.password = existingUserData.password
        }

        let filename: string | null = null
        let avatar: string | null

        if (updateUserDto.avatar) {
            const arrayBuffer = await updateUserDto.avatar.arrayBuffer()
            const buffer = new Uint8Array(arrayBuffer)

            const fileExtension = updateUserDto.avatar.name.split(".").pop()
            filename = `avatar_${new Date().toISOString().replace(/[-:.]/g, "")}.${fileExtension}`

            await fs.writeFile(`./public/images/avatars/${filename}`, buffer)

            avatar = filename
        } else {
            avatar = existingUserData.avatar ? existingUserData.avatar : null
        }

        await updateDoc(userDocRef, {
            ...updateUserDto,
            avatar: avatar
        })

        return {userId: updateUserDto.id}
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10)
}

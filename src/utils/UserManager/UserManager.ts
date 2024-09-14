"use server"

import {addDoc, collection} from "@firebase/firestore"
import {db2} from "@/db/firebase.config"
import {isUserRole, UserEntity} from "@/utils/UserManager/User.interfaces"
import bcrypt from "bcrypt"
import fs from "node:fs/promises"

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

        createUserDto.password = await bcrypt.hash(createUserDto.password, 10)

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
    }
}
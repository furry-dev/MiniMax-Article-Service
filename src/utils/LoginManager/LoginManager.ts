"use server"

import bcrypt from "bcrypt"
import * as UserManager from "@/utils/UserManager/UserManager"
import {createToken} from "@/utils/jwtTokenControl/jwtTokenControl"

export async function Login(formData: FormData) {
    const uid = formData.get("uid") as string | null
    const password = formData.get("password") as string | null

    if (!uid || !password) throw Error("Missing required fields: uid and password")

    const userData = await loginUser(uid, password)

    if (!userData) return undefined

    return createToken(userData)
}

async function loginUser(uid: string, password: string) {
    try {
        const formData = new FormData()
        formData.set("uid", uid)
        const userData = await UserManager.GetUser(formData)

        if (!userData) return undefined

        if (await comparePassword(password, userData.password)) return userData
    } catch (error) {
        console.error("Error logging in:", error)
        throw error
    }
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
    const isPasswordCorrect = await bcrypt.compare(password, hash)

    if (isPasswordCorrect) {
        return true
    } else {
        throw new Error("Incorrect password")
    }
}

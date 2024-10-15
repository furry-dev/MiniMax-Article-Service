import * as jose from "jose"
import {cookies} from "next/headers"
import {UserEntityWithId} from "@/utils/UserManager/User.interfaces"
import jwt from "jsonwebtoken"

const jwtConfig = {
    secret: new TextEncoder().encode(process.env.JWT_SECRET)
}

export function createToken(user: UserEntityWithId) {
    const now = new Date()
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    const expiresIn = Math.floor((endOfDay.getTime() - now.getTime()) / 1000)

    return jwt.sign({
        uid: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role
    }, process.env.JWT_SECRET as string, {expiresIn: `${expiresIn}s`})
}

export async function decodeToken() {
    const token = cookies().get("token")?.value as string | undefined

    if (token) {
        try {
            return await jose.jwtVerify(token, jwtConfig.secret)
        } catch (err) {
            console.error("isAuthenticated error: ", err)

            return false
        }
    } else {
        return false
    }
}

import * as jose from "jose"
import {cookies} from "next/headers"
import {UserEntityWithId} from "@/utils/UserManager/User.interfaces"
import jwt from "jsonwebtoken"

const jwtConfig = {
    secret: new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
}

export function createToken(user: UserEntityWithId) {
    return jwt.sign({
        uid: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role
    }, process.env.NEXT_PUBLIC_JWT_SECRET as string, {expiresIn: "1d"})
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

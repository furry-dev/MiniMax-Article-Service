import {cookies} from "next/headers"
import {NextRequest, NextResponse} from "next/server"
import {decodeToken} from "@/utils/jwtTokenControl/jwtTokenControl"
import {UserRole} from "@/utils/UserManager/User.interfaces"


export async function middleware(req: NextRequest) {
    const token = cookies().get("token")?.value as string | undefined

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    try {
        const decoded = await decodeToken()

        if (!decoded) return NextResponse.redirect(new URL("/login", req.url))

        const role = decoded.payload.role as UserRole

        if (new URL(req.url).pathname.startsWith("/admin") && !(role === "developer" || role === "admin")) return new NextResponse(null, {status: 403})
    } catch (error) {
        return NextResponse.redirect(new URL("/login", req.url))
    }
}

export const config = {
    matcher: [
        "/((?!login|api|_next/static|_next/image|images|favicon.ico).*)"
    ]
}

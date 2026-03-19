import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that require authentication
const protectedPaths = ["/publicar", "/mis-tratos", "/proponer-trueque"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path requires authentication
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  // Check for NextAuth session token cookie (JWT strategy)
  const sessionToken =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token")

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/publicar", "/mis-tratos", "/proponer-trueque/:path*"],
}

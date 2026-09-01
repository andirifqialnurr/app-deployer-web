import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPrefixes = ["/dashboard", "/apps", "/releases", "/settings", "/api/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return new NextResponse("Admin credentials are not configured.", { status: 503 });
  }

  const authHeader = request.headers.get("authorization");
  if (isBasicAuthValid(authHeader, expectedEmail, expectedPassword)) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="App Deployer"',
    },
  });
}

function isBasicAuthValid(
  authHeader: string | null,
  expectedEmail: string,
  expectedPassword: string,
) {
  if (!authHeader?.startsWith("Basic ")) {
    return false;
  }

  const encoded = authHeader.slice("Basic ".length);
  const decoded = atob(encoded);
  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex < 0) {
    return false;
  }

  const email = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  return email === expectedEmail && password === expectedPassword;
}

export const config = {
  matcher: ["/dashboard/:path*", "/apps/:path*", "/releases/:path*", "/settings/:path*", "/api/admin/:path*"],
};

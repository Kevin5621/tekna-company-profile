import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define role-based route permissions
const routePermissions: Record<string, ("admin" | "editor" | "hr")[]> = {
  "/dashboard": ["admin", "editor", "hr"],
  "/dashboard/projects": ["admin", "editor"],
  "/dashboard/blog": ["admin", "editor"],
  "/dashboard/career": ["admin", "hr"],
  "/dashboard/footer": ["admin"],
  "/dashboard/admin": ["admin"],
  "/dashboard/newsletter": ["admin"],
  "/dashboard/settings": ["admin", "editor", "hr"],
};

async function getUserRole(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
): Promise<string | null> {
  try {
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    return userRole?.role || null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

function hasPermission(pathname: string, userRole: string): boolean {
  type RoleType = "admin" | "editor" | "hr";

  // Check exact match first
  if (routePermissions[pathname]) {
    return routePermissions[pathname].includes(userRole as RoleType);
  }

  // Check parent routes for nested paths
  for (const route in routePermissions) {
    if (pathname.startsWith(route + "/")) {
      return routePermissions[route].includes(userRole as RoleType);
    }
  }

  // Default: allow access to routes not explicitly defined in routePermissions
  return true;
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get current path first
  const { pathname } = req.nextUrl;

  // Check auth status using getSession() for middleware
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  const user = session?.user;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/blog",
  ];
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/blog") {
      return pathname === "/blog" || pathname.startsWith("/blog/");
    }
    return route === pathname;
  });

  // Reduce logging for public routes
  const shouldLog =
    !isPublicRoute || sessionError || pathname.startsWith("/dashboard");
  if (shouldLog) {
    console.log(
      "Middleware - Path:",
      pathname,
      "Session Error:",
      sessionError,
      "User:",
      user ? user.id : "Not authenticated"
    );
  }

  // Admin routes that require specific roles
  const adminRoutes = ["/dashboard/admin", "/dashboard/newsletter"];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Dashboard routes that require authentication
  const dashboardRoutes = ["/dashboard"];
  const isDashboardRoute = dashboardRoutes.some(
    (route) => pathname.startsWith(route) && !isPublicRoute
  );

  // Allow access to public routes without authentication checks
  if (isPublicRoute) {
    return res;
  }

  // Check if user is properly authenticated
  const isAuthenticated = user && session && !sessionError;

  if (isAdminRoute && !isAuthenticated) {
    console.log("Middleware - Admin route access denied, redirecting to login");
    const response = NextResponse.redirect(new URL("/auth/login", req.url));
    response.cookies.delete("sb-access-token");
    response.cookies.delete("sb-refresh-token");
    return response;
  }

  if (isDashboardRoute && !isAuthenticated) {
    console.log(
      "Middleware - Dashboard route access denied, redirecting to login"
    );
    const response = NextResponse.redirect(new URL("/auth/login", req.url));
    response.cookies.delete("sb-access-token");
    response.cookies.delete("sb-refresh-token");
    return response;
  }

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (isAuthenticated && pathname === "/auth/login") {
    console.log(
      "Middleware - Authenticated user accessing login, redirecting to dashboard"
    );
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user is not authenticated and on login page, allow access
  if (pathname === "/auth/login" && !isAuthenticated) {
    console.log(
      "Middleware - Unauthenticated user on login page, allowing access"
    );
    return res;
  }

  // Role-based access control for dashboard routes
  if (isDashboardRoute && isAuthenticated) {
    const userRole = await getUserRole(supabase, user.id);

    if (userRole && !hasPermission(pathname, userRole)) {
      console.log(
        `Middleware - User role '${userRole}' denied access to '${pathname}', redirecting to dashboard`
      );
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - images folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|public|images|api).*)",
  ],
};

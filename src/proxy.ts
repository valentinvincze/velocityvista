import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./lib/supabase/server";

const ADMIN_ROLES = ["admin", "coo"];

function redirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const role: string | undefined = user?.app_metadata?.role;
  const isAdmin = !!role && ADMIN_ROLES.includes(role);

  if (!user && !pathname.startsWith("/auth")) {
    return redirect(request, "/auth/signin");
  }

  if (pathname === "/auth/signup") {
    const supabase = await createClient();
    const token = request.nextUrl.searchParams.get("token");

    if (!token) return redirect(request, "/auth/signin");

    const { data, error } = await supabase
      .from("invites")
      .select("expires_at")
      .eq("token", token);

    if (error) {
      console.error(
        "Supabase error during invites table fetch:",
        error.message,
      );
      return redirect(request, "/auth/signin");
    }

    if (!data[0]) return redirect(request, "/auth/signin");

    const today = new Date().getTime();
    const expiry = new Date(data[0].expires_at).getTime();

    if (expiry <= today) return redirect(request, "/auth/signin");
  }

  if (user) {
    if (isAdmin && pathname === "/dashboard") {
      return redirect(request, "/dashboard/admin");
    }

    if (!isAdmin && pathname.startsWith("/dashboard/admin")) {
      return redirect(request, "/dashboard");
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

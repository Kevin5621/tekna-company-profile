"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/session-provider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AdminHeader() {
  const { user } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Redirect ke halaman utama karena login sudah dihapus
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        </div>

        {/* Right Side Actions - Only Theme Toggle and Logout */}
        <div className="flex items-center gap-4">
          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Logout Button */}
          {user && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

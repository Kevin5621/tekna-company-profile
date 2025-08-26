import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Di sini bisa ditambahkan Navigasi Breadcrumb atau Judul Halaman dinamis */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        {hasEnvVars ? <AuthButton /> : null}
      </div>
    </header>
  );
}

import { AppHeader } from "@/components/layout/public-header";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 md:px-6 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Tekna. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

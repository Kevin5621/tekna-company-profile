"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/components/session-provider";
import {
  AdminAuthService,
  type AdminUser,
} from "@/lib/services/admin-auth.service";
import { UpdatePasswordForm } from "@/components/update-password-form";

export default function ProfileSettingsForm({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  const { refreshSession } = useSession();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const adminUser = await AdminAuthService.getCurrentAdmin();
        setCurrentUser(adminUser);
        setDisplayName(adminUser.profile?.first_name || adminUser.email || "");
        setEmail(adminUser.email);
      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to load user profile.");
      }
    };
    load();
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsLoading(true);
    setMessage(null);
    setErrorMessage(null);

    try {
      // Update profile (display name)
      await AdminAuthService.updateUserProfile(currentUser.id, {
        display_name: displayName,
      });

      // Email is read-only in profile settings
      setMessage("Profile updated successfully.");

      // Refresh session to get new data
      await refreshSession();
      // Reload local state
      const adminUser = await AdminAuthService.getCurrentAdmin();
      setCurrentUser(adminUser);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update profile."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeVariant = (
    role: string
  ): "default" | "destructive" | "secondary" | "outline" => {
    switch (role) {
      case "admin":
        return "destructive";
      case "editor":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>
            Perbarui nama tampilan dan detail profil Anda. Email tidak dapat
            diubah di sini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} readOnly />
              <p className="text-xs text-muted-foreground">
                Email tidak dapat diubah di halaman profil. Untuk mengubah
                alamat email, gunakan pengaturan akun atau hubungi
                administrator.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Badge variant={getRoleBadgeVariant(currentUser.role)}>
                  {currentUser.role}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Badge
                  variant={currentUser.is_active ? "default" : "secondary"}
                >
                  {currentUser.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            {message && <p className="text-sm text-green-600">{message}</p>}
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}

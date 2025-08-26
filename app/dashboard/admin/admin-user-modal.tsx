"use client";

import { useState, useEffect, type FC } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { IconUserPlus, IconUserEdit } from "@tabler/icons-react";
import { AdminAuthService, type AdminUser } from "@/lib/services/admin-auth.service";

interface AdminUserModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
  readonly user?: AdminUser | null;
  readonly mode?: 'create' | 'edit';
}

export const AdminUserModal: FC<AdminUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user = null,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "editor" as 'admin' | 'editor',
    is_active: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        email: user.email,
        password: "", // Password not needed for edit mode
        first_name: user.profile?.first_name || "",
        last_name: user.profile?.last_name || "",
        role: user.role,
        is_active: user.is_active,
      });
    } else {
      resetForm();
    }
  }, [user, mode, isOpen]);

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      role: "editor",
      is_active: true,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'create') {
        await AdminAuthService.createCompleteAdminUser({
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          role: formData.role,
        });
      } else if (user) {
        await AdminAuthService.updateAdminUser(user.id, {
          role: formData.role,
          is_active: formData.is_active,
          profile: {
            id: user.profile?.id || '',
            user_id: user.id,
            first_name: formData.first_name,
            last_name: formData.last_name,
            preferences: user.profile?.preferences || {},
            created_at: user.profile?.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        });
      }

      onSuccess();
      handleClose();
    } catch (err) {
      console.error("Error saving admin user:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderTitle = () => {
    const isCreateMode = mode === 'create';
    const Icon = isCreateMode ? IconUserPlus : IconUserEdit;
    const title = isCreateMode ? "Add New Admin User" : "Edit Admin User";
    
    return (
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        {title}
      </div>
    );
  };

  const renderDescription = () => {
    return mode === 'create'
      ? "Create a new admin user with a specific role and permissions."
      : "Update the user's information, role, and status.";
  };

  const renderSubmitButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          Saving...
        </>
      );
    }
    return mode === 'create' ? 'Create User' : 'Update User';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{renderTitle()}</DialogTitle>
          <DialogDescription>{renderDescription()}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              disabled={mode === 'edit'}
            />
          </div>

          {mode === 'create' && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                type="text"
                placeholder="John"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                type="text"
                placeholder="Doe"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: 'admin' | 'editor') => 
                setFormData(prev => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData.role === 'editor' 
                ? "Editors can manage blog posts and projects."
                : "Admins can manage all content and system settings."
              }
            </p>
          </div>

          {mode === 'edit' && (
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Active Status</Label>
                <p className="text-xs text-muted-foreground">
                  Inactive users cannot log in.
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked: boolean) => 
                  setFormData(prev => ({ ...prev, is_active: checked }))
                }
              />
            </div>
          )}



          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {renderSubmitButtonContent()}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
import { AdminAuthService } from "@/lib/services/admin-auth.service";
import AdminClient from "./admin-client";

export default async function AdminManagementPage() {
  try {
    const users = await AdminAuthService.getAllAdminUsers();
    return <AdminClient initialUsers={users} />;
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return <AdminClient initialUsers={[]} />;
  }
}

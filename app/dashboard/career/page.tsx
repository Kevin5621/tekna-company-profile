import { CareerService } from "@/lib/services/career";
import CareerClient from "./career-client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CareerManagementPage() {
  try {
    // Check authentication and role
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("User not authenticated, redirecting to login...");
      redirect("/auth/login");
    }
    
    // Check if user has admin/HR role
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();
    
    if (!userRole || (userRole.role !== 'admin' && userRole.role !== 'hr')) {
      console.log("User does not have admin/HR role, redirecting...");
      redirect("/dashboard");
    }
    
    const careerService = new CareerService(supabase);
    const positions = await careerService.getAllPositions();

    return <CareerClient initialPositions={positions} />;
  } catch (error) {
    console.error("Error fetching career data for page:", error);
    return <CareerClient initialPositions={[]} />;
  }
}

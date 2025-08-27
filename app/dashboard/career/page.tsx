import { CareerService } from "@/lib/services/career";
import CareerClient from "./career-client";

export default async function CareerManagementPage() {
  try {
    const careerService = new CareerService();
  const positions = await careerService.getAllPositions();

  return <CareerClient initialPositions={positions} />;
  } catch (error) {
    console.error("Error fetching career data for page:", error);
  return <CareerClient initialPositions={[]} />;
  }
}

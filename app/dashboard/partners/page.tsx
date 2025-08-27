import { Metadata } from "next";
import PartnersClient from "./partners-client";

export const metadata: Metadata = {
  title: "Partners Management",
  description: "Manage your company partners",
};

export default async function PartnersPage() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/partners`, {
      cache: "no-store",
    });
    const json = await res.json();
    const partners = json?.partners || [];
    return <PartnersClient initialPartners={partners} />;
  } catch (error) {
    console.error("Error fetching partners in server page:", error);
    return <PartnersClient initialPartners={[]} />;
  }
}

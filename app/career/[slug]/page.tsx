import CareerPositionClient from "./career-position-client";

interface CareerPositionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CareerPositionPage({
  params,
}: CareerPositionPageProps) {
  const { slug } = await params;

  return <CareerPositionClient slug={slug} />;
}

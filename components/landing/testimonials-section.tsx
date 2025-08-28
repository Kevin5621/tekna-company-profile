import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

// Hardcoded testimonials data
const hardcodedTestimonials = [
  {
    id: 1,
    client_name: "Ahmad Rizki",
    client_position: "CEO",
    client_company: "PT Maju Bersama",
    client_avatar_url: undefined,
    testimonial_text:
      "Tekna has helped us develop a highly effective digital platform. Their team is professional and the results exceeded our expectations.",
  },
  {
    id: 2,
    client_name: "Sarah Wijaya",
    client_position: "Marketing Director",
    client_company: "Global Solutions Indonesia",
    client_avatar_url: undefined,
    testimonial_text:
      "Collaboration with Tekna is very enjoyable. They understand our business needs and provide targeted solutions.",
  },
  {
    id: 3,
    client_name: "Budi Santoso",
    client_position: "CTO",
    client_company: "TechStart Indonesia",
    client_avatar_url: undefined,
    testimonial_text:
      "Tekna's work quality is very high. They not only develop applications but also ensure optimal scalability and security.",
  },
  {
    id: 4,
    client_name: "Diana Putri",
    client_position: "Product Manager",
    client_company: "Innovate Digital",
    client_avatar_url: undefined,
    testimonial_text:
      "The Tekna team is very responsive and communicative. They always provide clear updates and accommodate our feedback well.",
  },
  {
    id: 5,
    client_name: "Rendra Kusuma",
    client_position: "Founder",
    client_company: "StartupHub Jakarta",
    client_avatar_url: undefined,
    testimonial_text:
      "Tekna helped our startup from idea to launch-ready product. Their expertise in modern technology is very impressive.",
  },
  {
    id: 6,
    client_name: "Maya Sari",
    client_position: "Operations Director",
    client_company: "E-Commerce Pro",
    client_avatar_url: undefined,
    testimonial_text:
      "The e-commerce platform developed by Tekna has significantly increased our sales. The user experience they created is very user-friendly.",
  },
];

export async function TestimonialsSection() {
  // Use hardcoded testimonials instead of fetching from database
  const testimonials = hardcodedTestimonials;

  if (testimonials.length === 0) {
    return null; // Don't render the section if there are no testimonials
  }

  return (
    <section className="w-full py-24 md:py-32 lg:py-40 bg-background relative z-30">
      {/* Smooth transition gradient from top */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background via-background/95 to-transparent" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-muted-foreground">
            We are proud to work with great companies.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-card">
              <CardContent className="p-6">
                <p className="mb-6 text-muted-foreground">
                  &ldquo;{testimonial.testimonial_text || ""}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={testimonial.client_avatar_url || undefined}
                    />
                    <AvatarFallback>
                      {testimonial.client_name &&
                      testimonial.client_name.length > 0
                        ? testimonial.client_name.charAt(0).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.client_name || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.client_position || "Position"},{" "}
                      {testimonial.client_company || "Company"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

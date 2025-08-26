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
    testimonial_text: "Tekna telah membantu kami mengembangkan platform digital yang sangat efektif. Tim mereka profesional dan hasilnya melebihi ekspektasi kami."
  },
  {
    id: 2,
    client_name: "Sarah Wijaya",
    client_position: "Marketing Director",
    client_company: "Global Solutions Indonesia",
    client_avatar_url: undefined,
    testimonial_text: "Kolaborasi dengan Tekna sangat menyenangkan. Mereka memahami kebutuhan bisnis kami dan memberikan solusi yang tepat sasaran."
  },
  {
    id: 3,
    client_name: "Budi Santoso",
    client_position: "CTO",
    client_company: "TechStart Indonesia",
    client_avatar_url: undefined,
    testimonial_text: "Kualitas kerja Tekna sangat tinggi. Mereka tidak hanya mengembangkan aplikasi, tapi juga memastikan skalabilitas dan keamanan yang optimal."
  },
  {
    id: 4,
    client_name: "Diana Putri",
    client_position: "Product Manager",
    client_company: "Innovate Digital",
    client_avatar_url: undefined,
    testimonial_text: "Tim Tekna sangat responsif dan komunikatif. Mereka selalu memberikan update yang jelas dan mengakomodasi feedback kami dengan baik."
  },
  {
    id: 5,
    client_name: "Rendra Kusuma",
    client_position: "Founder",
    client_company: "StartupHub Jakarta",
    client_avatar_url: undefined,
    testimonial_text: "Tekna membantu startup kami dari ide hingga produk yang siap diluncurkan. Keahlian mereka dalam teknologi modern sangat mengesankan."
  },
  {
    id: 6,
    client_name: "Maya Sari",
    client_position: "Operations Director",
    client_company: "E-Commerce Pro",
    client_avatar_url: undefined,
    testimonial_text: "Platform e-commerce yang dikembangkan Tekna telah meningkatkan penjualan kami secara signifikan. User experience yang mereka buat sangat user-friendly."
  }
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
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">Apa Kata Klien Kami</h2>
          <p className="mt-4 text-muted-foreground">
            Kami bangga dapat bekerja sama dengan perusahaan-perusahaan hebat.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-card">
              <CardContent className="p-6">
                <p className="mb-6 text-muted-foreground">&ldquo;{testimonial.testimonial_text || ''}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.client_avatar_url || undefined} />
                    <AvatarFallback>
                      {testimonial.client_name && testimonial.client_name.length > 0 
                        ? testimonial.client_name.charAt(0).toUpperCase() 
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.client_name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.client_position || 'Position'}, {testimonial.client_company || 'Company'}
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

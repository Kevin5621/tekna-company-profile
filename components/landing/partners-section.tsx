'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  website: string | null;
  is_active: boolean;
  sort_order: number;
}

export function PartnersSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(containerRef, { once: true, margin: "-100px" });
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        console.log('Fetching partners...');
        const response = await fetch('/api/partners');
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Partners data:', data);
        
        if (data.success) {
          // Filter active partners and remove duplicates
          const activePartners = data.partners.filter((partner: Partner) => partner.is_active);
          console.log('Active partners:', activePartners);
          const uniquePartners: Partner[] = [];
          const seenIds = new Set<string>();
          
          for (const partner of activePartners) {
            if (!seenIds.has(partner.id)) {
              seenIds.add(partner.id);
              uniquePartners.push(partner);
            }
          }
          
          console.log('Unique partners:', uniquePartners);
          setPartners(uniquePartners.slice(0, 6)); // Limit to 6 partners
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  if (loading) {
    return (
      <section className="w-full py-24 md:py-32 bg-background relative z-20 pointer-events-auto">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              We collaborate with innovative companies worldwide to deliver exceptional digital solutions.
            </p>
          </div>

          {/* Loading Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={`loading-${i}`} className="flex flex-col items-center text-center space-y-4 animate-pulse">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-2xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-24 md:py-32 bg-background relative z-20 pointer-events-auto">
      <motion.div
        ref={containerRef}
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="container mx-auto px-4 md:px-6"
      >
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            We collaborate with innovative companies worldwide to deliver exceptional digital solutions.
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              variants={itemVariants}
              className="group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Partner Logo */}
                <motion.div
                  className="relative w-24 h-24 md:w-32 md:h-32 bg-card rounded-2xl p-4 shadow-lg border border-border/50 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  {partner.logo_url ? (
                    <Image
                      src={partner.logo_url}
                      alt={partner.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 96px, 128px"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                      {partner.name.charAt(0)}
                    </div>
                  )}
                </motion.div>

                {/* Partner Name */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground text-sm md:text-base">
                    {partner.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground max-w-[120px]">
                    {partner.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="text-muted-foreground mb-6">
            Ready to join our network of successful partnerships?
          </p>
          <motion.button
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Become a Partner
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}

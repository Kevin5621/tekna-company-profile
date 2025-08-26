'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const placeholderIds = ['ph1', 'ph2', 'ph3', 'ph4', 'ph5', 'ph6'];

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        console.log('Fetching partners...');
        const response = await fetch('/api/partners?limit=12');
        console.log('Response status:', response.status);

        type PartnersResponse = {
          success?: boolean;
          partners?: Partner[];
          error?: string;
        };

        let data: PartnersResponse = {};
        const text = await response.text();
        try {
          data = text ? JSON.parse(text) as PartnersResponse : {};
        } catch (err) {
          console.error('Failed to parse JSON from /api/partners:', err, 'raw:', text);
          data = {};
        }

        console.log('Partners data:', data);

  if (response.ok && data?.success) {
          // Filter active partners and remove duplicates
          const activePartners = (data.partners || []).filter((partner: Partner) => partner.is_active);
          const uniquePartners: Partner[] = [];
          const seenIds = new Set<string>();

          for (const partner of activePartners) {
            if (!seenIds.has(partner.id)) {
              seenIds.add(partner.id);
              uniquePartners.push(partner);
            }
          }

          setPartners(uniquePartners.slice(0, 6)); // Limit to 6 partners
        } else {
          console.warn('/api/partners returned no data or error', { status: response.status, data });
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: 'easeOut' as const }
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
            {placeholderIds.map((id) => (
              <div key={id} className="flex flex-col items-center text-center space-y-4 animate-pulse">
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

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
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
                  <p className="text-sm text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                    {partner.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
  </div>
    </section>
  );
}

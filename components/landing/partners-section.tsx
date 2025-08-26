'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const partners = [
  { 
    name: 'TechCorp Solutions', 
    logo: '/logo.webp',
    description: 'Leading technology solutions provider'
  },
  { 
    name: 'InnovateTech', 
    logo: '/logo.webp',
    description: 'Innovation-driven software company'
  },
  { 
    name: 'Global Manufacturing', 
    logo: '/logo.webp',
    description: 'International manufacturing leader'
  },
  { 
    name: 'Digital Dynamics', 
    logo: '/logo.webp',
    description: 'Digital transformation experts'
  },
  { 
    name: 'Cloud Systems', 
    logo: '/logo.webp',
    description: 'Cloud infrastructure specialists'
  },
  { 
    name: 'Smart Solutions', 
    logo: '/logo.webp',
    description: 'AI-powered business solutions'
  }
];

export function PartnersSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(containerRef, { once: true, margin: "-100px" });

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

  return (
    <section className="w-full py-24 md:py-32 bg-background relative z-20">
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
              key={partner.name}
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
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 96px, 128px"
                  />
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

'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface ProjectData {
  id: string;
  name: string;
  slug: string;
  project_url?: string;
  featured_image_url?: string;
  description: string;
  short_description: string;
  images: {
    image_url: string;
    alt_text?: string;
    caption?: string;
    sort_order: number;
  }[];
}

export function ProjectsSectionClient({ projects }: { projects: ProjectData[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(containerRef, { once: true, margin: "-100px" });

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ 
        zIndex: 20, // Lower than sticky hero section
        marginTop: '-200vh', // Strong overlap with hero section
        paddingTop: '250vh', // Space for the overlapping effect
        background: 'transparent' // Buat background transparan agar globe terlihat
      }}
    >
      {/* Enhanced background with depth effect - lebih transparan */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80" />
      
      {/* Smooth transition gradient to solid background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/95 to-transparent" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative z-10"
      >
        {/* Projects List - 1 viewport per project */}
        <div className="space-y-0">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              custom={index}
              initial={{ opacity: 0, scale: 0.8, y: 80, filter: "blur(10px)" }}
              whileInView={{ 
                opacity: 1, 
                scale: 1, 
                y: 0, 
                filter: "blur(0px)",
                transition: {
                  duration: 0.6,
                  ease: "easeOut"
                }
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="min-h-screen flex items-center justify-center py-20"
            >
              <ProjectRow project={project} isReversed={index % 2 === 1} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ProjectRow({ project, isReversed }: { readonly project: ProjectData; readonly isReversed: boolean }) {
  // Enhanced image animation dengan parallax-like effect
  const imageVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 1.2,
      rotateY: isReversed ? -20 : 20,
      rotateX: 5,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Enhanced content animation
  const contentVariants: Variants = {
    hidden: {
      opacity: 0,
      x: isReversed ? 60 : -60,
      y: 30,
      scale: 0.95,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const textVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 25,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 xl:gap-40 items-center`}>
        {/* Enhanced Image Section */}
        <motion.div 
          className={`${isReversed ? 'lg:order-2' : 'lg:order-1'}`}
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          whileHover={{ 
            scale: 1.02, 
            rotateY: isReversed ? 2 : -2,
            transition: { duration: 0.3 }
          }}
        >
          <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
            {project.featured_image_url ? (
              <motion.div
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full h-full"
              >
                <Image
                  src={project.featured_image_url}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <motion.span 
                  className="text-primary-foreground text-xl font-semibold"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {project.name}
                </motion.span>
              </div>
            )}
            
            {/* Enhanced Status Badge */}
            <motion.div 
              className="absolute top-4 right-4"
              initial={{ opacity: 0, scale: 0.6, rotateZ: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, rotateZ: 5 }}
            >
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Content Section */}
        <motion.div 
          className={`space-y-6 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Enhanced Project Header */}
          <motion.div 
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {project.name}
            </h3>
          </motion.div>

          {/* Enhanced Description */}
          <motion.div 
            className="prose prose-foreground max-w-none"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-muted-foreground leading-relaxed text-base">
              {project.short_description || project.description}
            </p>
          </motion.div>

          {/* Enhanced Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 pt-2"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {project.project_url && (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Button size="lg" className="flex items-center gap-2 shadow-lg" asChild>
                  <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Lihat Proyek
                  </a>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

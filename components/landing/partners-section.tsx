"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider';
import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur';

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

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        console.log("Fetching partners...");
        const response = await fetch("/api/partners?limit=20");
        console.log("Response status:", response.status);

        type PartnersResponse = {
          success?: boolean;
          partners?: Partner[];
          error?: string;
        };

        let data: PartnersResponse = {};
        const text = await response.text();
        try {
          data = text ? (JSON.parse(text) as PartnersResponse) : {};
        } catch (err) {
          console.error(
            "Failed to parse JSON from /api/partners:",
            err,
            "raw:",
            text
          );
          data = {};
        }

        console.log("Partners data:", data);

        if (response.ok && data?.success) {
          // Filter active partners and remove duplicates
          const activePartners = (data.partners || []).filter(
            (partner: Partner) => partner.is_active
          );
          const uniquePartners: Partner[] = [];
          const seenIds = new Set<string>();

          for (const partner of activePartners) {
            if (!seenIds.has(partner.id)) {
              seenIds.add(partner.id);
              uniquePartners.push(partner);
            }
          }

          setPartners(uniquePartners);
        } else {
          console.warn("/api/partners returned no data or error", {
            status: response.status,
            data,
          });
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const skeletonIds = [
    "sk-0",
    "sk-1",
    "sk-2",
    "sk-3",
    "sk-4",
    "sk-5",
    "sk-6",
    "sk-7",
  ];

  if (loading) {
    return (
      <section className="bg-background py-16 md:py-24">
        <div className="group relative m-auto max-w-6xl px-6">
          <div className="py-6">
            <div className="flex gap-24 animate-pulse">
              {skeletonIds.map((id) => (
                <div key={id} className="flex shrink-0">
                  <div className="w-64 h-24 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="group relative m-auto max-w-6xl px-6">
        <div className="flex items-center">
          <div className="inline md:max-w-44 md:border-r md:border-border md:pr-6">
            <p className="text-end text-sm text-muted-foreground">Trusted by industry leaders</p>
          </div>
          <div className="relative py-6 md:w-[calc(100%-11rem)]">
            <InfiniteSlider
              speedOnHover={20}
              speed={40}
              gap={112}>
              {partners.map((partner) => (
                <div key={partner.id} className="flex items-center justify-center">
                  {partner.logo_url ? (
                    <div className="relative h-24 w-64">
                      <Image
                        className="object-contain dark:invert filter grayscale hover:grayscale-0 transition-all duration-300"
                        src={partner.logo_url}
                        alt={`${partner.name} Logo`}
                        fill
                        sizes="256px"
                      />
                    </div>
                  ) : (
                    <div className="h-24 px-10 bg-muted rounded flex items-center justify-center text-muted-foreground text-base font-medium">
                      {partner.name.split(' ').map(word => word.charAt(0)).join('').slice(0, 3)}
                    </div>
                  )}
                </div>
              ))}
            </InfiniteSlider>

            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent"></div>
            <ProgressiveBlur
              className="pointer-events-none absolute left-0 top-0 h-full w-20"
              direction="left"
              blurIntensity={1}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute right-0 top-0 h-full w-20"
              direction="right"
              blurIntensity={1}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

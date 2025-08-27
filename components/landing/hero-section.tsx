"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { XIcon } from "lucide-react";

export function HeroSection() {
  const [contentOpacity, setContentOpacity] = useState({
    content1: 1,
    content2: 0,
    content3: 0,
  });

  // Form state for the contact dialog
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset form when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can add your form submission logic
    console.log("Form submitted:", formData);
    // Close dialog after submission
    setDialogOpen(false);
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
  };

  // Scroll animation handler for sticky hero content transitions
  useEffect(() => {
    let ticking = false;

    const updateScrollY = () => {
      const currentScrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      // Define transition ranges for sticky hero content
      const content1End = viewportHeight * 0.8; // Content 1 visible until 80vh scroll
      const content2Start = viewportHeight * 0.6; // Content 2 starts appearing at 60vh
      const content2End = viewportHeight * 1.6; // Content 2 visible until 160vh scroll
      const content3Start = viewportHeight * 1.4; // Content 3 starts appearing at 140vh
      const content3End = viewportHeight * 2.4; // Content 3 visible until 240vh scroll

      // Calculate opacity for each content section
      let content1Opacity = 0;
      let content2Opacity = 0;
      let content3Opacity = 0;

      // Content 1 logic - starts visible, fades out
      if (currentScrollY <= content1End) {
        content1Opacity = 1;
      } else {
        content1Opacity = Math.max(
          0,
          1 - (currentScrollY - content1End) / (viewportHeight * 0.4)
        );
      }

      // Content 2 logic - fades in then out
      if (currentScrollY >= content2Start && currentScrollY <= content2End) {
        if (currentScrollY < content1End) {
          // Fade in
          content2Opacity =
            (currentScrollY - content2Start) / (content1End - content2Start);
        } else if (currentScrollY > content2End - viewportHeight * 0.4) {
          // Fade out
          content2Opacity = Math.max(
            0,
            1 -
              (currentScrollY - (content2End - viewportHeight * 0.4)) /
                (viewportHeight * 0.4)
          );
        } else {
          // Fully visible
          content2Opacity = 1;
        }
      }

      // Content 3 logic - fades in and stays visible longer
      if (currentScrollY >= content3Start) {
        if (currentScrollY < content3End) {
          content3Opacity = Math.min(
            1,
            (currentScrollY - content3Start) / (viewportHeight * 0.4)
          );
        } else {
          // Fade out when projects section is near
          content3Opacity = Math.max(
            0,
            1 - (currentScrollY - content3End) / (viewportHeight * 0.3)
          );
        }
      }

      // Update state with calculated opacities
      setContentOpacity({
        content1: Math.max(0, Math.min(1, content1Opacity)),
        content2: Math.max(0, Math.min(1, content2Opacity)),
        content3: Math.max(0, Math.min(1, content3Opacity)),
      });

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollY);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollY(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Hero section with sticky content that stays centered */}
      <section
        className="relative"
        style={{
          height: "400vh", // Increased height for better sticky effect
          background: "transparent", // Buat background transparan
        }}
      >
        {/* Sticky container that remains centered during scroll */}
        <div
          className="sticky top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none"
          style={{
            zIndex: 40, // Higher than projects section to stay visible
            background: "transparent", // Pastikan container juga transparan
          }}
        >
          {/* Content 1 - Initial Hero Text with smooth transitions */}
          <motion.div
            className="absolute z-10 text-center max-w-4xl px-4 pointer-events-none"
            style={{
              opacity: contentOpacity.content1,
              transform: `translateY(${
                contentOpacity.content1 === 1 ? 0 : 20
              }px)`,
              transition: "all 0.3s ease-out",
            }}
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-foreground mb-6">
              With Tekna
              <br />
              Serving The Universe
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Building scalable websites, mobile apps, and IoT solutions for the
              future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 pointer-events-auto"
                  >
                    Reach Us
                  </Button>
                </DialogTrigger>
                <DialogPrimitive.Portal>
                  <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0" />
                  <DialogPrimitive.Content className="fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-md transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0">
                    <DialogHeader>
                      <DialogTitle>Contact Us</DialogTitle>
                      <DialogDescription>
                        Fill in your details and we&apos;ll get back to you
                        soon.
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Work Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            placeholder="your.email@company.com"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            placeholder="+1 (555) 123-4567"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) =>
                              handleInputChange("company", e.target.value)
                            }
                            placeholder="Your company name"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) =>
                              handleInputChange("message", e.target.value)
                            }
                            placeholder="Tell us about your project..."
                            className="min-h-[100px]"
                            required
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="submit" className="w-full">
                          Send Message
                        </Button>
                      </DialogFooter>
                    </form>

                    <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                      <XIcon className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                  </DialogPrimitive.Content>
                </DialogPrimitive.Portal>
              </Dialog>
            </div>
          </motion.div>

          {/* Content 2 - Our Services with smooth transitions */}
          <motion.div
            className="absolute z-10 text-center max-w-4xl px-4 pointer-events-none"
            style={{
              opacity: contentOpacity.content2,
              transform: `translateY(${
                contentOpacity.content2 === 1 ? 0 : 20
              }px)`,
              transition: "all 0.3s ease-out",
            }}
          >
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-foreground mb-6">
              Innovation Meets
              <br />
              Excellence
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              From concept to deployment, we deliver cutting-edge technology
              solutions that transform your business.
            </p>
          </motion.div>

          {/* Content 3 - Featured Projects with smooth transitions */}
          <motion.div
            className="absolute z-10 text-center max-w-4xl px-4 pointer-events-none"
            style={{
              opacity: contentOpacity.content3,
              transform: `translateY(${
                contentOpacity.content3 === 1 ? 0 : 20
              }px)`,
              transition: "all 0.3s ease-out",
            }}
          >
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-foreground mb-6">
              Featured Projects
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Explore our latest projects and see how we&apos;ve transformed
              businesses across industries.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}

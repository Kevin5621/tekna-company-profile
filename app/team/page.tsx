import { ContentManagementService } from "@/lib/services/content-management.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, Calendar, Hash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PublicLayout } from "@/components/layout/public-layout";

export default async function TeamPage() {
  const contentService = new ContentManagementService();
  
  try {
    const teamMembers = await contentService.getPublicTeamMembers();
    
    if (teamMembers.length === 0) {
      return (
        <PublicLayout>
          <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
            {/* Enhanced Header Section with better visual hierarchy */}
            <header className="text-center mb-16 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Meet Our Team
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Get to know the talented individuals who make our company great.
                </p>
              </div>
            </header>

            {/* Empty State */}
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Team Information Coming Soon
              </h2>
              <p className="text-foreground/80 mb-6">
                We&apos;re working on adding information about our team members. In the meantime, feel free to contact us directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/career"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View Open Positions
                </Link>
                <a
                  href="mailto:careers@tekna.com"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                >
                  Send Application
                </a>
              </div>
            </div>
          </div>
        </PublicLayout>
      );
    }

    // Sort team members by sort_order
    const sortedTeamMembers = teamMembers.toSorted((a, b) => a.sort_order - b.sort_order);

    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
          {/* Enhanced Header Section with better visual hierarchy */}
          <header className="text-center mb-16 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Meet Our Team
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Get to know the talented individuals who make our company great.
              </p>
            </div>
          </header>

          {/* Team Members */}
          <main role="main" aria-label="Team members">
            <div className="max-w-6xl mx-auto">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {sortedTeamMembers.map((member) => (
                  <div key={member.id} className="group">
                    <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-all duration-300 group-hover:border-cyan-200 dark:group-hover:border-cyan-800">
                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={member.avatar_url} alt={member.name} />
                          <AvatarFallback className="text-lg">
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Name and Position */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-semibold text-foreground mb-1">
                          {member.name}
                        </h3>
                        <p className="text-primary font-medium">
                          {member.position}
                        </p>
                      </div>

                      {/* Bio */}
                      {member.bio && (
                        <div className="text-center mb-6">
                          <p className="text-foreground/80 text-sm leading-relaxed">
                            {member.bio}
                          </p>
                        </div>
                      )}

                      {/* Social Links */}
                      <div className="flex justify-center gap-3 mb-4">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                            aria-label={`Email ${member.name}`}
                          >
                            <Mail className="h-4 w-4 text-primary" />
                          </a>
                        )}
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                          aria-label={`LinkedIn ${member.name}`}
                        >
                          <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      {member.twitter_url && (
                        <a
                          href={member.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                          aria-label={`Twitter ${member.name}`}
                        >
                          <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        </a>
                      )}
                      {member.github_url && (
                        <a
                          href={member.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                          aria-label={`GitHub ${member.name}`}
                        >
                          <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </a>
                      )}
                      </div>

                      {/* Member Info */}
                      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(member.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          {member.sort_order}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-12" />

              {/* Join Our Team Section */}
              <div className="text-center py-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Join Our Team
                </h2>
                <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
                  We&apos;re always looking for talented individuals to join our growing team. 
                  Explore our career opportunities and be part of our success story.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/career"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    View Open Positions
                  </Link>
                  <a
                    href="mailto:careers@tekna.com"
                    className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    Send Application
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </PublicLayout>
    );
  } catch (error) {
    console.error("Error loading team members:", error);
    notFound();
  }
}

export async function generateMetadata() {
  return {
    title: "Our Team - Meet the People Behind Tekna",
    description: "Get to know the talented individuals who make our company great. Meet our team of experts and innovators.",
    keywords: "team, employees, staff, company, about us, careers, jobs",
  };
}

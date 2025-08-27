"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import { useRealtimeAuthors } from "@/lib/hooks/use-realtime-simple";
import { IconPlus, IconEdit, IconTrash, IconMail } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardPageTemplate } from "@/components/dashboard/dashboard-page-template";

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  position: string;
  department: string | null;
  avatar_url: string | null;
  is_active: boolean;
  sort_order?: number;
}

interface AuthorsPageClientProps {
  readonly initialAuthors: Author[];
}

export function AuthorsPageClient({ initialAuthors }: AuthorsPageClientProps) {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useRealtimeAuthors(() => {
    const refreshAuthors = async () => {
      try {
        const updatedAuthors = await ClientDashboardService.getAuthors();
        setAuthors(updatedAuthors);
      } catch (error) {
        console.error("Error refreshing authors:", error);
      }
    };
    refreshAuthors();
  });

  const handleDelete = async (authorId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the author "${name}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await ClientDashboardService.deleteAuthor(authorId);
      setAuthors((prev) => prev.filter((author) => author.id !== authorId));
      toast({
        title: "Author Deleted!",
        description: "Author has been deleted successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting author:", error);
      toast({
        title: "Delete Failed",
        description:
          error instanceof Error ? error.message : "Failed to delete author",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (authorId: string) => {
    router.push(`/dashboard/authors/edit/${authorId}`);
  };

  const handleAddNew = () => {
    router.push("/dashboard/authors/new");
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const actions = (
    <Button onClick={handleAddNew}>
      <IconPlus className="h-4 w-4 mr-2" />
      Add Author
    </Button>
  );

  return (
    <DashboardPageTemplate
      breadcrumbs={[
        { label: "Penulis", href: "/dashboard/authors" },
        { label: "Daftar Penulis", isCurrentPage: true },
      ]}
      title="Authors"
      description="Manage authors/team members for blog articles"
      actions={actions}
    >
      {/* Authors Grid */}
      {authors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">No authors created yet</p>
            <Button onClick={handleAddNew}>
              <IconPlus className="h-4 w-4 mr-2" />
              Create First Author
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => (
            <Card key={author.id} className="flex flex-col">
              <CardHeader className="flex-none">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={author.avatar_url || undefined} />
                    <AvatarFallback className="text-lg">
                      {getInitials(author.first_name, author.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {author.first_name} {author.last_name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {author.position}
                    </p>
                    {author.department && (
                      <p className="text-xs text-muted-foreground">
                        {author.department}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 space-y-3">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <IconMail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{author.email}</span>
                    </div>
                  </div>

                  {/* Status & Order */}
                  <div className="flex items-center justify-between">
                    <Badge variant={author.is_active ? "default" : "secondary"}>
                      {author.is_active ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Order: {author.sort_order}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(author.id)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <IconEdit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleDelete(
                        author.id,
                        `${author.first_name} ${author.last_name}`
                      )
                    }
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <IconTrash className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardPageTemplate>
  );
}

"use client";

import { useState, useMemo } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientDashboardService } from "@/lib/services/client-dashboard.service";
import { useRealtimeBlogPosts } from "@/lib/hooks/use-realtime-simple";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconUser,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;
  featured_image_url: string | null;
  author_name: string | null;
  category_id: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  is_featured: boolean;
  is_active: boolean;
  view_count?: number;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

interface BlogPageClientProps {
  readonly initialPosts: BlogPost[];
}

export function BlogPageClient({ initialPosts }: BlogPageClientProps) {
  const router = useRouter();
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: apiPayload } = useSWR("/api/posts", fetcher, {
    fallbackData: { success: true, data: initialPosts },
    revalidateOnFocus: true,
  });
  const posts = (apiPayload?.data as BlogPost[]) || initialPosts;
  const loading = !apiPayload;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"created_at" | "title" | "status">(
    "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  useRealtimeBlogPosts(() => {
    globalMutate("/api/posts");
  });

  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt &&
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | Date, bValue: string | Date;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [posts, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the article "${title}"?`)) {
      return;
    }

    try {
      const optimistic = posts.filter((p) => p.id !== postId);
      globalMutate("/api/posts", { success: true, data: optimistic }, false);

      await ClientDashboardService.deletePost(postId);
      await globalMutate("/api/posts");

      toast({
        title: "Article Deleted!",
        description: "Article has been deleted successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Delete Failed",
        description:
          error instanceof Error ? error.message : "Failed to delete article",
        variant: "destructive",
      });
      await globalMutate("/api/posts");
    }
  };

  const handleEdit = (postId: string) => {
    router.push(`/dashboard/blog/edit/${postId}`);
  };

  const handleAddNew = () => {
    router.push("/dashboard/blog/new");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: {
        label: "Draft",
        variant: "secondary" as const,
        color: "bg-yellow-100 text-yellow-800",
      },
      published: {
        label: "Published",
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
      },
      archived: {
        label: "Archived",
        variant: "outline" as const,
        color: "bg-gray-100 text-gray-800",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-3 items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage blog posts and articles
          </p>
        </div>
        
        <Button size="sm" onClick={handleAddNew}>
          <IconPlus className="h-4 w-4 mr-2" />
          Add Post
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-40">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="w-full sm:w-40">
          <Select value={sortBy} onValueChange={(value: "created_at" | "title" | "status") => setSortBy(value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="w-9 h-9"
        >
          {sortOrder === "asc" ? (
            <IconSortAscending className="h-4 w-4" />
          ) : (
            <IconSortDescending className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Posts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Articles</h2>
          <p className="text-xs text-muted-foreground">
            {filteredPosts.length} of {posts.length} posts
          </p>
        </div>

        {filteredPosts.length === 0 ? (
          <Card className="border-2 border-dashed border-muted bg-muted/30">
            <CardContent className="p-8 text-center">
              <IconEdit className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-medium mb-2">No posts found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Start creating your first blog post."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button size="sm" onClick={handleAddNew}>
                  <IconPlus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-sm transition-all duration-200 overflow-hidden">
                <CardContent className="p-0">
                  {/* Featured Image */}
                  <div className="aspect-[16/10] bg-muted/50 flex items-center justify-center relative overflow-hidden">
                    {post.featured_image_url ? (
                      <Image
                        src={post.featured_image_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="text-center space-y-1">
                        <IconEdit className="w-8 h-8 text-muted-foreground mx-auto" />
                        <p className="text-xs text-muted-foreground">No Image</p>
                      </div>
                    )}
                    
                    {/* Hover overlay with actions */}
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(post.id)}
                        className="bg-background hover:bg-background/90 text-foreground h-8 px-3"
                      >
                        <IconEdit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(post.id, post.title)}
                        className="h-8 px-3"
                      >
                        <IconTrash className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  {/* Post Info */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                          {post.title}
                        </h3>
                        {post.is_featured && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      {post.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <IconUser className="w-3 h-3" />
                          <span className="truncate max-w-20">{post.author_name || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <IconCalendar className="w-3 h-3" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(post.status)}
                        {post.view_count !== undefined && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            {post.view_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

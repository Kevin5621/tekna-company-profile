"use client";

import { useState, useMemo } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { SkeletonList } from "@/components/ui/skeleton-list";
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
  IconEye,
  IconCalendar,
  IconUser,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconExternalLink,
} from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardPageTemplate } from "@/components/dashboard/dashboard-page-template";

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
    const [isLoading, setIsLoading] = useState(false);
    const posts = (apiPayload?.data as BlogPost[]) || initialPosts;
    const loading = !apiPayload;
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"created_at" | "title" | "status">(
      "created_at"
    );
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [expandedPost, setExpandedPost] = useState<string | null>(null);
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

      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    const handleEdit = (postId: string) => {
      router.push(`/dashboard/blog/edit/${postId}`);
    };

    const handleAddNew = () => {
      router.push("/dashboard/blog/new");
    };

    const toggleExpanded = (postId: string) => {
      setExpandedPost(expandedPost === postId ? null : postId);
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

    const getStatusCount = (status: string) => {
      return posts.filter((post) => post.status === status).length;
    };

    const actions = (
      <Button onClick={handleAddNew}>
        <IconPlus className="h-4 w-4 mr-2" />
        Add Post
      </Button>
    );

    return (
      <DashboardPageTemplate
        breadcrumbs={[
          { label: "Blog", href: "/dashboard/blog" },
          { label: "Daftar Artikel", isCurrentPage: true },
        ]}
        title="Blog Posts"
        description="Manage blog posts and articles"
        actions={actions}
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Artikel
                  </p>
                  <p className="text-2xl font-bold">{posts.length}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <IconEdit size={20} className="text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Published
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {getStatusCount("published")}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <IconEye size={20} className="text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Draft
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {getStatusCount("draft")}
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <IconEdit size={20} className="text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Featured
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {posts.filter((post) => post.is_featured).length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <IconEye size={20} className="text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <IconSearch
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Cari artikel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value: "created_at" | "title" | "status") =>
                  setSortBy(value)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Tanggal Dibuat</SelectItem>
                  <SelectItem value="title">Judul</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Order */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="w-10"
              >
                {sortOrder === "asc" ? (
                  <IconSortAscending size={16} />
                ) : (
                  <IconSortDescending size={16} />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Grid */}
        {loading ? (
          <SkeletonList rows={6} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="group hover:shadow-lg transition-all duration-200"
              >
                {/* Featured Image */}
                {post.featured_image_url && (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={post.featured_image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {post.is_featured && (
                      <Badge className="absolute top-2 right-2 bg-purple-600">
                        Featured
                      </Badge>
                    )}
                  </div>
                )}

                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(post.id)}
                        className="h-8 w-8"
                      >
                        <IconEdit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id, post.title)}
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        disabled={isLoading}
                      >
                        <IconTrash size={14} />
                      </Button>
                    </div>
                  </div>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <IconUser size={14} />
                      <span>{post.author_name || "Unknown Author"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <IconCalendar size={14} />
                      <span>
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                    </div>

                    {post.view_count !== undefined && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <IconEye size={14} />
                        <span>{post.view_count} views</span>
                      </div>
                    )}
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(post.status)}
                      {post.is_featured && (
                        <Badge
                          variant="outline"
                          className="text-purple-600 border-purple-200"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(post.id)}
                        className="text-xs"
                      >
                        {expandedPost === post.id ? "Sembunyikan" : "Detail"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                        className="text-xs gap-1"
                      >
                        <IconExternalLink size={12} />
                        View
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedPost === post.id && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div className="text-xs space-y-1">
                        <p>
                          <strong>Slug:</strong> /blog/{post.slug}
                        </p>
                        <p>
                          <strong>Created:</strong> {formatDate(post.created_at)}
                        </p>
                        <p>
                          <strong>Updated:</strong> {formatDate(post.updated_at)}
                        </p>
                        {post.meta_title && (
                          <p>
                            <strong>Meta Title:</strong> {post.meta_title}
                          </p>
                        )}
                        {post.meta_description && (
                          <p>
                            <strong>Meta Description:</strong>{" "}
                            {post.meta_description}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post.id)}
                          className="flex-1"
                        >
                          <IconEdit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(`/blog/${post.slug}`, "_blank")
                          }
                          className="flex-1"
                        >
                          <IconExternalLink size={14} className="mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <IconEdit size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Tidak ada artikel ditemukan
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Coba ubah filter atau kata kunci pencarian"
                  : "Mulai dengan membuat artikel pertama Anda"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button onClick={handleAddNew} className="gap-2">
                  <IconPlus size={16} />
                  Tambah Artikel Pertama
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </DashboardPageTemplate>
    );
  }

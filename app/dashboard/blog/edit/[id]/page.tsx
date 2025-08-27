import { DashboardService } from "@/lib/services/dashboard.service";
import { PostForm } from "@/components/post-form";
import { notFound } from "next/navigation";
import { DashboardFormTemplate } from "@/components/dashboard/dashboard-form-template";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  try {
    const { id } = await params;
    const post = await DashboardService.getBlogPostById(id);

    if (!post) {
      notFound();
    }

    const initialData = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      content_type: post.content_type || "markdown",
      featured_image_url: post.featured_image_url || "",
      author_name: post.author_name || "",
      category_id: post.category_id || "",
      status: post.status,
      published_at: post.published_at || "",
      is_featured: post.is_featured,
      meta_title: post.meta_title || "",
      meta_description: post.meta_description || "",
      meta_keywords: post.meta_keywords || "",
    };

    return (
      <DashboardFormTemplate
        breadcrumbs={[
          { label: "Blog", href: "/dashboard/blog" },
          { label: "Edit Post", isCurrentPage: true },
        ]}
        title="Edit Post"
        description="Update blog post information"
        backHref="/dashboard/blog"
        backLabel="Back to Blog"
      >
        <div className="dashboard-form-container">
          <PostForm postId={id} initialData={initialData} />
        </div>
      </DashboardFormTemplate>
    );
  } catch (error) {
    console.error("Error loading post:", error);
    notFound();
  }
}

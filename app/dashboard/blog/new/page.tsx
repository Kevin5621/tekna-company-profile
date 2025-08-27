import { PostForm } from "@/components/post-form";
import { DashboardFormTemplate } from "@/components/dashboard/dashboard-form-template";

export default function NewPostPage() {
  return (
    <DashboardFormTemplate
      breadcrumbs={[
        { label: "Blog", href: "/dashboard/blog" },
        { label: "New Post", isCurrentPage: true },
      ]}
      title="Add New Post"
      description="Create a new blog post with engaging content"
      backHref="/dashboard/blog"
      backLabel="Back to Blog"
    >
      <div className="dashboard-form-container">
        <PostForm />
      </div>
    </DashboardFormTemplate>
  );
}

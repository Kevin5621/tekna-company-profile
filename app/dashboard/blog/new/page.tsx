import { PostForm } from "@/components/post-form";
import { DashboardFormTemplate } from "@/components/dashboard/dashboard-form-template";

export default function NewPostPage() {
  return (
    <DashboardFormTemplate
      breadcrumbs={[
        { label: "Blog", href: "/dashboard/blog" },
        { label: "Tambah Artikel Baru", isCurrentPage: true },
      ]}
      title="Tambah Artikel Baru"
      description="Buat artikel blog baru dengan konten yang menarik"
      backHref="/dashboard/blog"
      backLabel="Kembali ke Blog"
    >
      <PostForm />
    </DashboardFormTemplate>
  );
}

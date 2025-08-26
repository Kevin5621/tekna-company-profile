import { DashboardService } from '@/lib/services/dashboard.service';
import { CategoriesPageClient } from './categories-client';

export default async function CategoriesPage() {
  const categories = await DashboardService.getCategories();

  return <CategoriesPageClient initialCategories={categories} />;
}

/**
 * Category model type and simple helpers.
 */
export interface Category {
  id?: number;
  name: string;
  color?: string; // hex color code, optional
  createdAt: string; // ISO timestamp
}

export function createCategoryRow(category: Omit<Category, 'id' | 'createdAt'>): Partial<Category> {
  // Keep this lightweight: consumer will add timestamps/ids in repository layer
  return { name: category.name, color: category.color };
}

import catalogueData from '@/data/catalogue.json';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
}

export interface Category {
  id: number;
  numberStr: string;
  name: string;
  slug: string;
  folderName: string | null;
  media: MediaItem[];
}

export const STORE_CONFIG = {
  primaryName: "WOOD HOME",
  secondaryName: "FURNITURE HOUSE",
  location: "AJMER, RAJASTHAN",
  tagline: "Furniture for Home, Office & Institutions",
  whatsappNumber: null,
};

export const catalogueRepository = {
  getAllCategories: (): Category[] => catalogueData as Category[],

  getCategoryBySlug: (slug: string): Category | undefined =>
    (catalogueData as Category[]).find(c => c?.slug === slug),

  searchCategories: (query: string): Category[] => {
    const q = query.toLowerCase().trim();
    if (!q) return catalogueData as Category[];

    return (catalogueData as Category[]).filter((c) => {
      if (!c) return false;

      const nameMatch = c.name?.toLowerCase().includes(q) ?? false;
      const numberMatch = c.numberStr?.toLowerCase().includes(q) ?? false;
      const folderMatch = c.folderName?.toLowerCase().includes(q) ?? false;

      return nameMatch || numberMatch || folderMatch;
    });
  }
};

// Standalone export alias for backward compatibility
export const searchCategories = catalogueRepository.searchCategories;
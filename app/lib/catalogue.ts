import catalogueData from '@/data/catalogue.json';

const SUPABASE_CDN_BASE = "https://bhoomezmalueqvfzhwzo.supabase.co/storage/v1/object/public/media";

export function getSupabaseUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${SUPABASE_CDN_BASE}/${cleanPath}`;
}

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

// Transform raw JSON data so all media URLs point directly to Supabase CDN
const formattedCatalogueData: Category[] = (catalogueData as Category[]).map((category) => {
  if (!category) return category;

  return {
    ...category,
    media: (category.media || []).map((item) => ({
      ...item,
      url: getSupabaseUrl(item.url),
    })),
  };
});

export const catalogueRepository = {
  getAllCategories: (): Category[] => formattedCatalogueData,

  getCategoryBySlug: (slug: string): Category | undefined =>
    formattedCatalogueData.find((c) => c?.slug === slug),

  searchCategories: (query: string): Category[] => {
    const q = query ? query.toLowerCase().trim() : "";
    if (!q) return formattedCatalogueData;

    return formattedCatalogueData.filter((c) => {
      if (!c) return false;

      const nameMatch = c.name?.toLowerCase().includes(q) ?? false;
      const numberMatch = c.numberStr?.toLowerCase().includes(q) ?? false;
      const folderMatch = c.folderName?.toLowerCase().includes(q) ?? false;

      return nameMatch || numberMatch || folderMatch;
    });
  },
};

// Standalone export alias for backward compatibility
export const searchCategories = catalogueRepository.searchCategories;
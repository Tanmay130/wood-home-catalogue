const SUPABASE_STORAGE_URL =
  "https://bhoomezmalueqvfzhwzo.supabase.co/storage/v1/object/public/media";

export function getSupabaseImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${SUPABASE_STORAGE_URL}/${cleanPath}`;
}
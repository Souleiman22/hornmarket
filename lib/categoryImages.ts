export const CATEGORY_IMAGES: Record<string, string> = {
  vehicules:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80",
  immobilier:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
  electronique:
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80",
  mode:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80",
  "maison-jardin":
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&q=80",
  "sports-loisirs":
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80",
  emploi:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80",
  services:
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80",
  famille:
    "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&q=80",
  autres:
    "https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=400&q=80",
};

export function getCategoryImage(slug: string): string {
  return (
    CATEGORY_IMAGES[slug] ??
    "https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=400&q=80"
  );
}

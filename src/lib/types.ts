export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  label?: "new" | "popular" | "bestseller" | null;
  category: "coffee" | "tea" | "smoothie" | "other";
  created_at?: string;
}

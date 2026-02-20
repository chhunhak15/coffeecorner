export interface Product {
  id: string;
  name: string;
  name_zh?: string | null;
  name_vi?: string | null;
  description: string;
  description_zh?: string | null;
  description_vi?: string | null;
  price: number;
  image_url: string;
  label?: "new" | "popular" | "bestseller" | null;
  category: "coffee" | "tea" | "smoothie" | "other";
  created_at?: string;
}

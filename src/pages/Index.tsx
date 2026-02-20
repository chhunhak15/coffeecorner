import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, Settings } from "lucide-react";
import logo from "@/assets/logo.jpg";

const SHOP_NAME_KEY = "shop_name";
export const getShopName = () => localStorage.getItem(SHOP_NAME_KEY) || "Coffee Corner";
export const setShopName = (name: string) => localStorage.setItem(SHOP_NAME_KEY, name);

const categories = [
{ key: "all", label: "All" },
{ key: "coffee", label: "Coffee" },
{ key: "tea", label: "Tea" },
{ key: "smoothie", label: "Smoothies" },
{ key: "other", label: "Other" }] as
const;

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopName, setShopNameState] = useState(getShopName());
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setShopNameState(getShopName());
    window.addEventListener("storage", onStorage);
    // Also poll localStorage in case admin is on same tab
    const interval = setInterval(() => setShopNameState(getShopName()), 1000);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(interval); };
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.
        from("products").
        select("*").
        order("created_at", { ascending: false });
        if (!mounted) return;
        if (error) {
          console.error("Products fetch error:", error.message, error.details, error.hint);
        }
        setProducts(data as Product[] || []);
      } catch (e) {
        console.error("Products fetch exception:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {mounted = false;};
  }, []);

  const filtered = activeCategory === "all" ?
  products :
  products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Shop Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-foreground tracking-tight">{shopName}</span>
          </div>
          <div className="flex items-center gap-2">
            {user ?
            <>
                {isAdmin &&
              <Button variant="outline" size="sm" onClick={() => navigate("/admin")} className="gap-2">
                    <Settings className="h-4 w-4" /> Dashboard
                  </Button>
              }
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </> :

            <Button variant="outline" size="sm" onClick={() => navigate("/login")} className="gap-2">
                <LogIn className="h-4 w-4" /> Admin Login
              </Button>
            }
          </div>
        </div>
      </header>

      <section className="py-16 px-4 text-center">
        <h2 className="text-5xl font-bold text-foreground mb-4">Our Drink Menu</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Handcrafted beverages made with love and the finest ingredients.
        </p>
      </section>

      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) =>
          <Button
            key={cat.key}
            variant={activeCategory === cat.key ? "default" : "secondary"}
            size="sm"
            onClick={() => setActiveCategory(cat.key)}
            className="rounded-full px-5">

              {cat.label}
            </Button>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 pb-20">
        {loading ?
        <p className="text-center text-muted-foreground py-12">Loading menu...</p> :
        filtered.length === 0 ?
        <p className="text-center text-muted-foreground py-12">No drinks in this category yet.</p> :

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) =>
          <ProductCard key={product.id} product={product} />
          )}
          </div>
        }
      </main>
    </div>);

};

export default Index;
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, Settings } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { getShopName } from "@/lib/shopSettings";
import { translations, type Lang } from "@/lib/i18n";

const categoryKeys = ["all", "coffee", "tea", "smoothie", "other"] as const;

const langOptions: { value: Lang; flag: string; label: string }[] = [
  { value: "en", flag: "🇺🇸", label: "EN" },
  { value: "zh", flag: "🇨🇳", label: "中文" },
  { value: "vi", flag: "🇻🇳", label: "VI" },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopName, setShopNameState] = useState(getShopName());
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "en");
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const t = translations[lang];

  useEffect(() => {
    const onStorage = () => setShopNameState(getShopName());
    window.addEventListener("storage", onStorage);
    // Also poll localStorage in case admin is on same tab
    const interval = setInterval(() => setShopNameState(getShopName()), 1000);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(interval); };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          console.error("Products fetch error:", error.message, error.code, error.hint);
          return;
        }
        setProducts((data as Product[]) || []);
      } catch (e) {
        console.error("Products fetch exception:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = activeCategory === "all" ?
  products :
  products.filter((p) => p.category === activeCategory);

  const changeLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Shop Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-foreground tracking-tight">{shopName}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="flex items-center gap-1 border border-border rounded-full px-1 py-1 bg-background">
              {langOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => changeLang(opt.value)}
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full transition-colors ${
                    lang === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{opt.flag}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            {user ? (
              <>
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={() => navigate("/admin")} className="gap-2">
                    <Settings className="h-4 w-4" /> {t.dashboard}
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
                  <LogOut className="h-4 w-4" /> {t.signOut}
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate("/login")} className="gap-2">
                <LogIn className="h-4 w-4" /> {t.adminLogin}
              </Button>
            )}
          </div>
        </div>
      </header>

      <section className="py-16 px-4 text-center">
        <h2 className="text-5xl font-bold text-foreground mb-4">{t.menuTitle}</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">{t.menuSubtitle}</p>
      </section>

      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categoryKeys.map((key) => (
            <Button
              key={key}
              variant={activeCategory === key ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveCategory(key)}
              className="rounded-full px-5"
            >
              {t.categories[key]}
            </Button>
          ))}
        </div>
      </div>

      <main className="container mx-auto px-4 pb-20">
        {loading ? (
          <p className="text-center text-muted-foreground py-12">{t.loading}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{t.noItems}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

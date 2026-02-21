import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, Settings } from "lucide-react";
import defaultLogo from "@/assets/logo.jpg";
import { getShopName, getShopLogo } from "@/lib/shopSettings";
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
  const [fetchError, setFetchError] = useState(false);
  const [shopName, setShopNameState] = useState(getShopName());
  const [shopLogo, setShopLogoState] = useState<string | null>(getShopLogo());
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "en");
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const t = translations[lang];

  useEffect(() => {
    const onStorage = () => {
      setShopNameState(getShopName());
      setShopLogoState(getShopLogo());
    };
    window.addEventListener("storage", onStorage);
    const interval = setInterval(() => {
      setShopNameState(getShopName());
      setShopLogoState(getShopLogo());
    }, 1000);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(interval); };
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .abortSignal(controller.signal);
      clearTimeout(timeout);
      if (error) {
        console.error("Products fetch error:", error.message, error.code, error.hint);
        setFetchError(true);
        return;
      }
      setProducts((data as Product[]) || []);
    } catch (e) {
      console.error("Products fetch exception:", e);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          {/* Main row: logo + lang + auth */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <img src={shopLogo || defaultLogo} alt="Shop Logo" className="h-8 sm:h-10 w-auto flex-shrink-0" />
              <span className="text-base sm:text-xl font-bold text-foreground tracking-tight truncate">{shopName}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Language switcher — inline on all sizes */}
              <div className="flex items-center gap-0.5 border border-border rounded-full px-1 py-0.5 sm:py-1 bg-background">
                {langOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => changeLang(opt.value)}
                    className={`flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full transition-colors ${
                      lang === opt.value
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{opt.flag}</span>
                    <span className="hidden sm:inline">{opt.label}</span>
                  </button>
                ))}
              </div>

              {user ? (
                <>
                  {isAdmin && (
                    <Button variant="outline" size="sm" onClick={() => navigate("/admin")} className="gap-1 sm:gap-2 h-8 px-2 sm:px-3 text-xs sm:text-sm">
                      <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">{t.dashboard}</span>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={signOut} className="gap-1 sm:gap-2 h-8 px-2 sm:px-3 text-xs sm:text-sm">
                    <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t.signOut}</span>
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate("/login")} className="gap-1 sm:gap-2 h-8 px-2 sm:px-3 text-xs sm:text-sm">
                  <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">{t.adminLogin}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="py-8 sm:py-16 px-4 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-2 sm:mb-4">{t.menuTitle}</h2>
        <p className="text-sm sm:text-lg text-muted-foreground max-w-md mx-auto">{t.menuSubtitle}</p>
      </section>

      <div className="container mx-auto px-3 sm:px-4 mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
          {categoryKeys.map((key) => (
            <Button
              key={key}
              variant={activeCategory === key ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveCategory(key)}
              className="rounded-full px-3 sm:px-5 text-xs sm:text-sm h-8 sm:h-9"
            >
              {t.categories[key]}
            </Button>
          ))}
        </div>
      </div>

      <main className="container mx-auto px-3 sm:px-4 pb-12 sm:pb-20">
        {loading ? (
          <p className="text-center text-muted-foreground py-12">{t.loading}</p>
        ) : fetchError ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Could not load menu. Please try again.</p>
            <Button variant="outline" onClick={fetchProducts}>Retry</Button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{t.noItems}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                lang={lang}
                isAdmin={isAdmin}
                onEdit={(p) => navigate("/admin", { state: { editProduct: p } })}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

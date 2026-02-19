import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const labelConfig = {
  new: { text: "NEW", className: "bg-accent text-accent-foreground" },
  popular: { text: "POPULAR", className: "bg-primary text-primary-foreground" },
  bestseller: { text: "BESTSELLER", className: "bg-destructive text-destructive-foreground" },
};

export function ProductCard({ product }: { product: Product }) {
  const label = product.label ? labelConfig[product.label] : null;

  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {label && (
          <Badge className={`absolute top-3 left-3 ${label.className} text-[10px] tracking-widest font-bold px-3 py-1 rounded-full shadow-lg`}>
            {label.text}
          </Badge>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-lg leading-tight text-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
          </div>
          <span className="text-xl font-bold text-primary whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

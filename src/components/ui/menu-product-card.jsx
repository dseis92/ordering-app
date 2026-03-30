import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "./card";
import { ButtonShadcn } from "./button-shadcn";
import { BadgeShadcn } from "./badge-shadcn";
import {
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "../../lib/formatters";

const CATEGORY_EMOJI = {
  appetizers: "🧀",
  "fish-fry": "🐟",
  burgers: "🍔",
  dinners: "🍽️",
  salads: "🥗",
};

const CATEGORY_BG = {
  appetizers: "from-amber-50 via-orange-50 to-amber-100",
  "fish-fry": "from-blue-50 via-cyan-50 to-teal-100",
  burgers: "from-rose-50 via-orange-50 to-amber-100",
  dinners: "from-purple-50 via-pink-50 to-rose-100",
  salads: "from-emerald-50 via-green-50 to-lime-100",
};

export function MenuProductCard({ item, onSelect }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const showPhoto = item.image && !imgError;
  const bg = CATEGORY_BG[item.category] ?? "from-gray-100 to-gray-50";
  const isSoldOut = item.soldOut;

  // Create an array of images (use single image if only one exists)
  const images = item.image ? [item.image] : [];

  const nextImage = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isAddedToCart || isSoldOut) return;
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      setIsAddedToCart(true);
      onSelect(item);
      setTimeout(() => setIsAddedToCart(false), 2000);
    }, 800);
  };

  return (
    <Card
      className="w-full max-w-sm overflow-hidden group bg-background text-foreground shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl cursor-pointer"
      onClick={() => !isSoldOut && onSelect(item)}
    >
      {/* Image carousel */}
      <div className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-br ${bg}`} style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}>
        {showPhoto && images.length > 0 ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-200" />
            )}
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={`${item.name} - View ${currentImageIndex + 1}`}
              className="object-cover w-full h-full"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: imgLoaded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl select-none group-hover:scale-110 transition-transform duration-300">
              {CATEGORY_EMOJI[item.category] ?? "🍽️"}
            </span>
          </div>
        )}

        {/* Navigation arrows - only show if multiple images */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ButtonShadcn
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </ButtonShadcn>
            <ButtonShadcn
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </ButtonShadcn>
          </div>
        )}

        {/* Image indicators - only show if multiple images */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-primary w-4" : "bg-primary/30"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isSoldOut && (
            <BadgeShadcn className="bg-red-600 hover:bg-red-600/90 text-white">
              Sold Out
            </BadgeShadcn>
          )}
          {item.featured && !isSoldOut && (
            <BadgeShadcn className="bg-amber-500 hover:bg-amber-500/90">
              Featured
            </BadgeShadcn>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg line-clamp-1 text-hilltop-charcoal tracking-tight">
              {item.name}
            </h3>
            <p className="text-sm text-hilltop-gray-light mt-1 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-2 border-t border-gray-100">
            <span className="text-2xl font-extrabold text-hilltop-green tracking-tight">
              {formatCurrency(item.price)}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-5 pt-0">
        <ButtonShadcn
          className="w-full bg-hilltop-green hover:bg-hilltop-green-hover text-white font-bold py-6 rounded-xl shadow-lg"
          style={{
            boxShadow: "0 4px 14px 0 rgba(10, 79, 57, 0.39)"
          }}
          onClick={handleAddToCart}
          disabled={isAddingToCart || isAddedToCart || isSoldOut}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Adding...
            </>
          ) : isAddedToCart ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isSoldOut ? "Sold Out" : "Add to Cart"}
            </>
          )}
        </ButtonShadcn>
      </CardFooter>
    </Card>
  );
}

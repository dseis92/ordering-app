import { Helmet } from 'react-helmet-async';
import brand from '../brand.config';

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noindex = false,
}) {
  const siteTitle = brand.name;
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = `${brand.tagline}. Order online for pickup or delivery. Famous for Kathy Mitchell's fish fry served daily. ${brand.address.full}`;
  const metaDescription = description || defaultDescription;
  const defaultImage = `${window.location.origin}/images/hilltop-logo3.png`;
  const ogImage = image || defaultImage;
  const canonicalUrl = url || window.location.href;

  const defaultKeywords = 'hilltop pub and grill, stevens point restaurant, fish fry, wisconsin restaurant, online ordering, food delivery, pickup, catering, burgers, pub food, bar food';
  const metaKeywords = keywords || defaultKeywords;

  // Schema.org structured data for local business
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": brand.name,
    "description": brand.tagline,
    "image": ogImage,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": brand.address.street,
      "addressLocality": brand.address.city,
      "addressRegion": brand.address.state,
      "postalCode": brand.address.zip,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "44.5236",
      "longitude": "-89.5746"
    },
    "telephone": brand.phone,
    "url": window.location.origin,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Sunday"],
        "opens": "10:30",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "10:30",
        "closes": "22:00"
      }
    ],
    "servesCuisine": ["American", "Pub Food", "Seafood"],
    "priceRange": "$$",
    "acceptsReservations": "False",
    "menu": `${window.location.origin}/`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": brand.rating,
      "reviewCount": brand.reviewCount
    }
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={ogImage} />

      {/* Additional Meta Tags */}
      <meta name="author" content={brand.name} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />

      {/* Local Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}

/**
 * CLIENT CONFIGURATION TEMPLATE
 *
 * Copy this file to your project as: src/brand.config.js
 * Replace all [CLIENT_*] placeholders with actual client information
 *
 * This is the ONLY file that needs client-specific configuration
 * Everything else in the app references this config
 */

export default {
  // ============================================
  // BASIC BUSINESS INFORMATION
  // ============================================

  name: "[CLIENT_BUSINESS_NAME]",
  // Example: "Joe's Pizza Palace"

  tagline: "[CLIENT_TAGLINE]",
  // Example: "Authentic New York Style Pizza Since 1985"

  specialties: "[CLIENT_SPECIALTIES]",
  // Example: "Famous for our wood-fired pizzas and homemade pasta"

  description: "[CLIENT_DESCRIPTION]",
  // Example: "Family-owned Italian restaurant serving the community for over 35 years"


  // ============================================
  // CONTACT INFORMATION
  // ============================================

  phone: "[CLIENT_PHONE]",
  // Example: "(555) 123-4567"
  // Format: (XXX) XXX-XXXX

  email: "[CLIENT_EMAIL]",
  // Example: "info@joespizza.com"

  address: {
    street: "[CLIENT_STREET_ADDRESS]",
    // Example: "123 Main Street"

    city: "[CLIENT_CITY]",
    // Example: "Brooklyn"

    state: "[CLIENT_STATE]",
    // Example: "NY"
    // Use 2-letter state code

    zip: "[CLIENT_ZIP]",
    // Example: "11201"

    // Full formatted address (auto-generated, no need to edit)
    get full() {
      return `${this.street}, ${this.city}, ${this.state} ${this.zip}`;
    }
  },


  // ============================================
  // BUSINESS HOURS
  // ============================================

  hours: {
    monday: "[HOURS_MONDAY]",       // Example: "11am - 10pm" or "Closed"
    tuesday: "[HOURS_TUESDAY]",     // Example: "11am - 10pm"
    wednesday: "[HOURS_WEDNESDAY]", // Example: "11am - 10pm"
    thursday: "[HOURS_THURSDAY]",   // Example: "11am - 11pm"
    friday: "[HOURS_FRIDAY]",       // Example: "11am - 12am"
    saturday: "[HOURS_SATURDAY]",   // Example: "12pm - 12am"
    sunday: "[HOURS_SUNDAY]",       // Example: "12pm - 9pm"
  },

  // Special hours (optional)
  specialHours: {
    // Example holiday hours
    // thanksgiving: "Closed",
    // christmas: "Closed",
    // newYears: "12pm - 8pm"
  },


  // ============================================
  // ORDER SETTINGS
  // ============================================

  // Order types offered
  orderTypes: {
    pickup: true,     // Set to false if not offering pickup
    delivery: true,   // Set to false if not offering delivery
    dineIn: false,    // Set to true if offering dine-in orders
  },

  // Delivery settings
  deliveryFee: [CLIENT_DELIVERY_FEE],
  // Example: 4.99
  // Set to 0 for free delivery

  deliveryRadius: [CLIENT_DELIVERY_RADIUS],
  // Example: 5
  // Delivery radius in miles

  minimumDeliveryOrder: [CLIENT_MIN_DELIVERY],
  // Example: 15.00
  // Minimum order amount for delivery
  // Set to 0 for no minimum

  minimumPickupOrder: [CLIENT_MIN_PICKUP],
  // Example: 0
  // Minimum order amount for pickup
  // Usually 0

  // Tax settings
  taxRate: [CLIENT_TAX_RATE],
  // Example: 0.08 (for 8% tax)
  // Example: 0.055 (for 5.5% tax)
  // Decimal format: divide percentage by 100

  // Estimated preparation times (in minutes)
  estimatedPickupMinutes: [CLIENT_PICKUP_TIME],
  // Example: 25
  // Average time for pickup orders

  estimatedDeliveryMinutes: [CLIENT_DELIVERY_TIME],
  // Example: 45
  // Average time for delivery orders

  // Service fees (optional)
  serviceFee: 0,
  // Example: 2.50
  // Additional service fee per order
  // Set to 0 if not charging

  serviceFeePercentage: 0,
  // Example: 0.05 (for 5%)
  // Percentage-based service fee
  // Set to 0 if not charging


  // ============================================
  // PAYMENT SETTINGS
  // ============================================

  paymentMethods: {
    cash: true,              // Accept cash on pickup/delivery
    card: true,              // Accept card on pickup/delivery
    onlinePayment: false,    // Accept online payment (requires Stripe)
  },

  // Stripe configuration (if using online payments)
  stripe: {
    enabled: false,
    // Set to true when ready to accept online payments

    publishableKey: "[STRIPE_PUBLISHABLE_KEY]",
    // Get from: https://dashboard.stripe.com/apikeys
    // Starts with: pk_live_ or pk_test_
  },


  // ============================================
  // SOCIAL MEDIA & LINKS
  // ============================================

  social: {
    facebook: "[CLIENT_FACEBOOK_URL]",
    // Example: "https://facebook.com/joespizza"
    // Set to null if not using

    instagram: "[CLIENT_INSTAGRAM_URL]",
    // Example: "https://instagram.com/joespizza"
    // Set to null if not using

    twitter: "[CLIENT_TWITTER_URL]",
    // Example: "https://twitter.com/joespizza"
    // Set to null if not using

    tiktok: null,
    // Example: "https://tiktok.com/@joespizza"

    yelp: "[CLIENT_YELP_URL]",
    // Example: "https://yelp.com/biz/joes-pizza"

    googleBusiness: "[CLIENT_GOOGLE_BUSINESS_URL]",
    // Example: "https://g.page/joespizza"
  },

  // Website (if they have an existing site)
  website: "[CLIENT_WEBSITE]",
  // Example: "https://joespizza.com"
  // Set to null if this IS their main website


  // ============================================
  // LOYALTY PROGRAM SETTINGS
  // ============================================

  loyalty: {
    enabled: true,
    // Set to false to disable loyalty program

    pointsPerDollar: 1,
    // Example: 1 point per $1 spent

    tiers: {
      bronze: { minPoints: 0, name: "Bronze", discount: 0 },
      silver: { minPoints: 250, name: "Silver", discount: 0.05 },
      gold: { minPoints: 500, name: "Gold", discount: 0.10 },
      platinum: { minPoints: 1000, name: "Platinum", discount: 0.15 },
    },

    rewardValue: 0.01,
    // Example: 0.01 = 1 point = $0.01
    // 100 points = $1.00
  },


  // ============================================
  // ADMIN SETTINGS
  // ============================================

  admin: {
    // Default admin credentials (CHANGE THESE!)
    defaultEmail: "[ADMIN_EMAIL]",
    // Example: "admin@joespizza.com"

    defaultPassword: "[ADMIN_PASSWORD]",
    // Example: "SecurePassword123!"
    // IMPORTANT: Change this after first login

    // Notification preferences
    notifications: {
      email: true,        // Email notifications for new orders
      sms: false,         // SMS notifications (requires Twilio)
      sound: true,        // Browser sound for new orders
    },
  },


  // ============================================
  // EMAIL SETTINGS (OPTIONAL)
  // ============================================

  email: {
    enabled: false,
    // Set to true when ready to send emails

    provider: "resend",
    // Options: "resend", "sendgrid", "mailgun"

    apiKey: "[EMAIL_API_KEY]",
    // Get from your email provider

    fromEmail: "[FROM_EMAIL]",
    // Example: "noreply@joespizza.com"

    fromName: "[FROM_NAME]",
    // Example: "Joe's Pizza"

    // Email templates
    templates: {
      orderConfirmation: true,    // Send order confirmation to customer
      orderReceived: true,        // Send notification to admin
      orderReady: false,          // Send "order ready" notification
    },
  },


  // ============================================
  // SMS SETTINGS (OPTIONAL)
  // ============================================

  sms: {
    enabled: false,
    // Set to true when ready to send SMS

    provider: "twilio",
    // Currently only supports Twilio

    accountSid: "[TWILIO_ACCOUNT_SID]",
    // Get from: https://console.twilio.com

    authToken: "[TWILIO_AUTH_TOKEN]",
    // Get from: https://console.twilio.com

    phoneNumber: "[TWILIO_PHONE_NUMBER]",
    // Example: "+15551234567"
    // Your Twilio phone number

    // SMS notifications
    notifications: {
      orderConfirmation: false,
      orderReady: true,    // Most useful: notify when order is ready
      orderOutForDelivery: true,
    },
  },


  // ============================================
  // FEATURE FLAGS
  // ============================================

  features: {
    // Enable/disable features as needed
    orderHistory: true,          // Customer order history
    loyaltyProgram: true,        // Loyalty points system
    catering: true,              // Catering page/orders
    about: true,                 // About us page
    reviews: false,              // Customer reviews section
    giftCards: false,            // Gift card purchases
    subscriptions: false,        // Subscription orders (e.g., weekly)
    scheduling: false,           // Schedule orders for future
    tips: true,                  // Allow tipping
    feedback: true,              // Order feedback/rating
  },


  // ============================================
  // SPECIAL FEATURES
  // ============================================

  // Daily specials
  dailySpecials: {
    enabled: true,

    specials: {
      // Example specials
      monday: "Half-price appetizers",
      tuesday: "Taco Tuesday - $2 tacos",
      wednesday: "Wine Wednesday - 50% off bottles",
      thursday: null,
      friday: "Fish Fry Special",
      saturday: null,
      sunday: "Family meal deals",
    },
  },

  // Seasonal menu
  seasonal: {
    enabled: false,
    // Set to true if you have seasonal items

    currentSeason: "spring",
    // Options: "spring", "summer", "fall", "winter"
  },


  // ============================================
  // ANALYTICS & TRACKING (OPTIONAL)
  // ============================================

  analytics: {
    // Google Analytics
    googleAnalyticsId: "[GA_TRACKING_ID]",
    // Example: "G-XXXXXXXXXX"
    // Get from: https://analytics.google.com

    // Facebook Pixel
    facebookPixelId: "[FB_PIXEL_ID]",
    // Example: "123456789012345"

    // Other tracking
    enabled: false,
  },


  // ============================================
  // SEO SETTINGS
  // ============================================

  seo: {
    title: "[SEO_TITLE]",
    // Example: "Joe's Pizza - Best NY Style Pizza in Brooklyn"

    description: "[SEO_DESCRIPTION]",
    // Example: "Order authentic New York style pizza online. Family-owned since 1985..."

    keywords: "[SEO_KEYWORDS]",
    // Example: "pizza, italian restaurant, delivery, brooklyn, ny style pizza"

    ogImage: "/images/og-image.jpg",
    // Social media preview image (1200x630px)
  },


  // ============================================
  // CUSTOM BRANDING
  // ============================================

  branding: {
    // Logo files
    logo: "/images/logo.png",
    logoWhite: "/images/logo-white.png",    // For dark backgrounds
    favicon: "/favicon.ico",

    // Hero section
    heroImage: "/images/hero-image.png",
    heroTitle: "[HERO_TITLE]",
    // Example: "Delicious Pizza Delivered to Your Door"

    heroSubtitle: "[HERO_SUBTITLE]",
    // Example: "Fresh ingredients, traditional recipes, modern convenience"

    // Colors (configured in tailwind.config.js)
    // primaryColor: "#..." - Set in Tailwind config
    // secondaryColor: "#..." - Set in Tailwind config
  },


  // ============================================
  // LEGAL & COMPLIANCE
  // ============================================

  legal: {
    businessName: "[LEGAL_BUSINESS_NAME]",
    // Example: "Joe's Pizza Palace LLC"

    businessLicense: "[BUSINESS_LICENSE_NUMBER]",
    // Your business license number

    privacyPolicyUrl: "/privacy",
    termsOfServiceUrl: "/terms",

    // Food handler certifications, etc.
    certifications: [],
  },


  // ============================================
  // DEVELOPMENT SETTINGS
  // ============================================

  dev: {
    // Demo mode (shows fake data)
    demoMode: false,

    // Debug logging
    debugMode: false,

    // Test mode (uses test API keys)
    testMode: false,
  },
};


/**
 * USAGE IN CODE:
 *
 * import brand from './brand.config.js';
 *
 * // Access any setting:
 * const businessName = brand.name;
 * const deliveryFee = brand.deliveryFee;
 * const isPickupEnabled = brand.orderTypes.pickup;
 *
 * // Calculate total with tax:
 * const total = subtotal * (1 + brand.taxRate);
 *
 * // Check feature flag:
 * if (brand.features.loyaltyProgram) {
 *   // Show loyalty features
 * }
 */


/**
 * QUICK START CHECKLIST:
 *
 * 1. Search for "[CLIENT_" and replace all placeholders
 * 2. Update business hours
 * 3. Set order types (pickup/delivery/dine-in)
 * 4. Configure pricing (delivery fee, tax rate, minimums)
 * 5. Set estimated times (pickup/delivery)
 * 6. Add social media links
 * 7. Configure admin credentials
 * 8. Enable/disable features as needed
 * 9. Test locally: npm run dev
 * 10. Deploy: vercel --prod
 *
 * That's it! The entire app is now customized for your client.
 */

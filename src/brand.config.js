const brand = {
  name: "Hilltop Pub and Grill",
  tagline: "Stevens Point's favorite since the 1980s",
  logo: null, // set to a path like "/logo.svg" to use an image
  colors: {
    primary: "#134611",   // forest
    accent: "#64b445",    // fern
    background: "#ecebe4", // linen
  },
  currency: "USD",
  taxRate: 0.055, // Wisconsin state sales tax (5.5%)
  orderTypes: ["pickup", "delivery"],
  estimatedPickupMinutes: 25,
  estimatedDeliveryMinutes: 35,
  deliveryFee: 2.99,
  minimumOrder: 12.00,
  rating: 4.6,
  reviewCount: 847,
  address: "4901 Main St., Stevens Point, WI 54481",
  phone: "(715) 341-3037",
  hours: "Mon & Sun 10:30am–9pm, Tue–Sat 10:30am–10pm",
  specialties: "Famous fish fry created by Kathy Mitchell in the early 1980s — served daily!",
};

export default brand;

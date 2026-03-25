const brand = {
  name: "Hilltop Pub and Grill",
  tagline: "Stevens Point's favorite since the 1980s",
  logo: "/images/hilltop-logo.png",
  colors: {
    primary: "#0a4f39",   // Hilltop deep forest green
    accent: "#11694d",    // Hilltop lighter green
    background: "#f6f6f6", // Hilltop light gray
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

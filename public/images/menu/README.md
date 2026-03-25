# Menu Images Guide

## How to Add Images for Menu Items

### Step 1: Add Your Food Photos Here

Place your food photos in this folder (`public/images/menu/`).

**Recommended specs:**
- Format: JPG or PNG
- Size: 800x600px or similar (landscape orientation)
- File size: Keep under 200KB for fast loading
- Name them descriptively (e.g., `cheese-curds.jpg`, `fish-fry.jpg`)

### Step 2: Update Menu Data

Edit `src/data/menu.js` and change the `image` property from `null` to your image path.

**Example:**

```javascript
{
  id: 1,
  category: "appetizers",
  name: "Cheese Curds",
  description: "Battered and fried white cheddar cheese curds.",
  price: 10.99,
  image: "/images/menu/cheese-curds.jpg",  // ← Add this path
  options: [],
}
```

### Quick Example

If you have a photo called `fish-fry.jpg` in this folder:

1. Place `fish-fry.jpg` here: `/public/images/menu/fish-fry.jpg`
2. Find the Fish Fry item in `src/data/menu.js`
3. Change: `image: null,`
4. To: `image: "/images/menu/fish-fry.jpg",`

### Tips

- The system automatically shows emojis if no image is provided
- Images have a nice hover effect that scales slightly on hover
- If an image fails to load, it falls back to the emoji
- You can add images gradually - no need to do all 71 items at once!

### Where to Get Food Photos

- Take your own photos at the restaurant
- Use a professional food photographer
- Use stock photos (ensure you have proper licensing)
- Generate with AI (Midjourney, DALL-E) - though real photos are better

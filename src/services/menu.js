import { supabase } from '../lib/supabase';

// Get all menu items
export async function getAllMenuItems() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('id');

  if (error) throw error;
  return data;
}

// Update menu item price
export async function updateMenuItemPrice(itemId, price) {
  const { data, error } = await supabase
    .from('menu_items')
    .update({ price })
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Toggle sold out status
export async function toggleMenuItemSoldOut(itemId, soldOut) {
  const { data, error} = await supabase
    .from('menu_items')
    .update({ sold_out: soldOut })
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Subscribe to real-time menu updates
export function subscribeToMenu(callback) {
  const channel = supabase
    .channel('menu-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'menu_items',
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Sync local menu to database (run once to populate)
export async function syncMenuToDatabase(menuItems) {
  // First, check if menu is already populated
  const { data: existing } = await supabase
    .from('menu_items')
    .select('id')
    .limit(1);

  if (existing && existing.length > 0) {
    console.log('Menu already populated in database');
    return;
  }

  // Insert all menu items
  const itemsToInsert = menuItems.map((item) => ({
    id: item.id,
    category: item.category,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image || null,
    featured: item.featured || false,
    sold_out: false,
    options: item.options || [],
  }));

  const { data, error } = await supabase
    .from('menu_items')
    .insert(itemsToInsert);

  if (error) throw error;
  console.log('Menu synced to database successfully');
  return data;
}

// Generates a stable unique ID for a menu item + its selected options
export const makeCartId = (itemId, selections) =>
  `${itemId}__${JSON.stringify(selections)}`;

import brand from "../brand.config";

export const calcTax = (subtotal) => subtotal * brand.taxRate;

export const calcTip = (subtotal, tipPercent) => subtotal * (tipPercent / 100);

export const calcTotal = (subtotal, tipPercent) =>
  subtotal + calcTax(subtotal) + calcTip(subtotal, tipPercent);

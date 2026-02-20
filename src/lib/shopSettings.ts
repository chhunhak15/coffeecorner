const SHOP_NAME_KEY = "shop_name";
export const getShopName = () => localStorage.getItem(SHOP_NAME_KEY) || "Coffee Corner";
export const setShopName = (name: string) => localStorage.setItem(SHOP_NAME_KEY, name);

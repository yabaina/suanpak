export type Page = "home" | "shop" | "cart" | "checkout" | "profile" | "login" | "register" | "forgot" | "admin" | "farmer";
export type ShopCategory = "all" | "veg" | "fruit" | "processed";
export type NavigateFn = (target: Page, category?: ShopCategory) => void;

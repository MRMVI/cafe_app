// Menu-related interface

// to API
export interface Item {
  name: string;
  description: string;
  photo: File | null;
  price: number;
  is_available: boolean;
  category: "beverages" | "food" | "specials" | "extras";
}

// schema
export interface MenuItemFromValues {
  name: string;
  description: string;
  price: number;
  is_available: boolean;
  category: "beverages" | "food" | "specials" | "extras";
}

// from API
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  photo_path: string;
  price: number;
  is_available: boolean;
  category: "beverages" | "food" | "specials" | "extras";
}

export interface AddItemResponse {
  message: string;
  item: Item;
}

export interface DestroyItemResponse {
  message: string;
}

export interface UpdateItemResponse {
  message: string;
  item: MenuItem;
}

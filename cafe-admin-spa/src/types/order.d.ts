export interface User {
  id: number;
  name: string;
  email: string;
  role: "user";
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  item_id: number;
  quantity: number;
  price: number;
  item: {
    id: number;
    name: string;
    price: number;
  };
}

export interface Order {
  id: number;
  user_id: number;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  updated_at: string;
  user: User;
  orderItems: OrderItem[];
}

export interface PaginatedOrders {
  data: Order[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

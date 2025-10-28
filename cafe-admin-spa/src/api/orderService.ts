import axios from "axios";
import type { Order } from "../types/order";

export async function getRecentOrders(limit = 5): Promise<Order[]> {
  const response = await axios.get(`/api/admin/orders?per_page=${limit}`);
  // Adjust if your backend uses a different structure
  return response.data.data.data || response.data.data;
}

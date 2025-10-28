import api from "./axios";
import type { Order, PaginatedOrders } from "../types/order";

const BASE_URL = "/admin/orders";

export const getOrders = async (params = {}): Promise<PaginatedOrders> => {
  const { data } = await api.get(BASE_URL, { params });
  return data.data;
};

export const getOrder = async (id: number): Promise<Order> => {
  const { data } = await api.get(`${BASE_URL}/${id}`);
  return data.data;
};

export const updateOrderStatus = async (
  id: number,
  status: "confirmed" | "cancelled"
): Promise<Order> => {
  const { data } = await api.put(`${BASE_URL}/${id}`, { status });
  return data.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};

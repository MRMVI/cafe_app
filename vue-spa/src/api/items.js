import api from "./axios";

export function createItem(payload) {
  return api.post("/admin/items", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

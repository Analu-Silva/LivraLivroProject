import http from "k6/http";
import { check } from "k6";

const BASE_URL = "http://localhost:8765";

export function createOrder(token, userId, email, bookIds, userType = 0) {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-User-Id": userId,
      "X-User-Email": email,
      "X-User-Type": String(userType),
    },
  };

  const payload = JSON.stringify({
    items: bookIds.map((id) => ({ bookId: id, quantity: 1 })),
    paymentMethodId: 1,
  });

  const res = http.post(`${BASE_URL}/ws/orders`, payload, headers);

  check(res, {
    "create order 200/201": (r) => [200, 201].includes(r.status),
  });

  try {
    const json = res.json();
    return json.id || json.orderId || null;
  } catch {
    return null;
  }
}

export function listOrders(token, userId, email, userType = 0) {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-User-Id": userId,
      "X-User-Email": email,
      "X-User-Type": String(userType),
    },
  };

  const res = http.get(`${BASE_URL}/ws/orders/BRL`, headers);

  check(res, {
    "orders status 200": (r) => r.status === 200,
  });

  return res.json();
}

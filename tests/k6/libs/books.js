import http from "k6/http";
import { check } from "k6";

const BASE_URL = "http://localhost:8765";

export function listBooks(token, userId, email, userType = 0) {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-User-Id": userId,
      "X-User-Email": email,
      "X-User-Type": String(userType),
    },
  };

  const res = http.get(`${BASE_URL}/books/BRL`, headers);

  check(res, {
    "list books 200": (r) => r.status === 200,
  });

  let books = [];

  try {
    const json = res.json();
    if (json.content) books = json.content;
    else if (Array.isArray(json)) books = json;
  } catch (_) {}

  return books.map((b) => b.id || b.bookId);
}

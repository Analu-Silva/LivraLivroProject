// load_test.js
import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';
import { htmlReport } from "../libs/k6-reporter-bundle.js";

export function handleSummary(data) {
    return {
        "C:/Dev/LivraLivro - Tests/k6/reports/html/spike_test_report.html": htmlReport(data, { debug: false }),
    };
}

function gerarCPFValido() {
  const n = [];
  for (let i = 0; i < 9; i++) n.push(Math.floor(Math.random() * 9));

  let d1 = 0;
  for (let i = 0; i < 9; i++) d1 += n[i] * (10 - i);
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;

  let d2 = 0;
  for (let i = 0; i < 9; i++) d2 += n[i] * (11 - i);
  d2 += d1 * 2;
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;

  return `${n.join("")}${d1}${d2}`;
}

export const options = {
  stages: [
    { duration: "5s", target: 100 }, // pico instantâneo!
    { duration: "10s", target: 100 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"],
    checks: ["rate>0.85"],
  },
};

const BASE_URL = "http://localhost:8765";

const DEFAULT_PASSWORD = "Senha123!";
const USER_TYPE = 0;

function randomEmail() {
  return `load.user.${Date.now()}-${Math.random().toString(36).substring(2)}@example.com`;
}

export default function () {
  let createdUserId = null;
  let createdUserEmail = null;
  let token = null;
  let orderId = null;

  // 1️⃣ SIGNUP
  group("Signup", () => {
    const payload = JSON.stringify({
      name: "Load Test User",
      email: randomEmail(),
      password: DEFAULT_PASSWORD,
      phoneNumber: "51999999999",
      cpf: gerarCPFValido(),
      dateOfBirth: "1990-01-01",
    });

    const res = http.post(`${BASE_URL}/auth/signup`, payload, {
      headers: { "Content-Type": "application/json" }
    });

    check(res, {
      "signup ok": (r) => r.status === 200 || r.status === 201,
    });

    if (![200, 201].includes(res.status)) fail("Falha no signup");

    const body = res.json();
    createdUserId = body.id;
    createdUserEmail = body.email;
  });

  // 2️⃣ SIGNIN
  group("Signin", () => {
    const payload = JSON.stringify({
      email: createdUserEmail,
      password: DEFAULT_PASSWORD,
    });

    const res = http.post(`${BASE_URL}/auth/signin`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    check(res, {
      "signin ok": (r) => r.status === 200,
      "has token": (r) => !!r.json("token"),
    });

    token = res.json("token");
    createdUserId = res.json("userId") || createdUserId;
  });

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-User-Id": createdUserId,
      "X-User-Email": createdUserEmail,
      "X-User-Type": String(USER_TYPE),
    },
  };

  // 3️⃣ LISTAR LIVROS
  let chosenBookIds = [];
  group("List Books", () => {
    const res = http.get(`${BASE_URL}/books/BRL`, authHeaders);
    check(res, { "books ok": (r) => r.status === 200 });

    try {
      const data = res.json();
      const list = data.content || data;

      if (Array.isArray(list)) {
        chosenBookIds = list.slice(0, 2).map((b) => b.id);
      }
    } catch (_) {}
  });

  // 4️⃣ CRIAR PEDIDO
  if (chosenBookIds.length > 0) {
    group("Create Order", () => {
      const payload = JSON.stringify({
        items: chosenBookIds.map((id) => ({ bookId: id, quantity: 1 })),
        paymentMethodId: 1,
      });

      const res = http.post(`${BASE_URL}/ws/orders`, payload, authHeaders);

      check(res, {
        "order created": (r) => [200, 201].includes(r.status),
      });

      try {
        orderId = res.json().id;
      } catch (_) {}
    });

    // 5️⃣ LISTAR PEDIDOS
    group("List Orders", () => {
      const res = http.get(`${BASE_URL}/ws/orders/BRL`, authHeaders);
      check(res, { "orders ok": (r) => r.status === 200 });
    });
  }

  sleep(1);

  // 6️⃣ DELETE USER
  group("Cleanup", () => {
    const res = http.del(`${BASE_URL}/ws/auth/deleteAccount/${createdUserId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    check(res, { "deleted": (r) => [200, 204, 202].includes(r.status) });
  });
}

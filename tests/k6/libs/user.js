import http from "k6/http";
import { check, fail } from "k6";
import { gerarCPFValido, gerarEmail } from "../utils/helpers.js";

const BASE_URL = "http://localhost:8765";
const DEFAULT_PASSWORD = "Senha123!";

export function createUser() {
  const email = gerarEmail();
  const payload = JSON.stringify({
    name: "Teste K6",
    email,
    password: DEFAULT_PASSWORD,
    phoneNumber: "51999999999",
    cpf: gerarCPFValido(),
    dateOfBirth: "1990-01-01",
  });

  const res = http.post(`${BASE_URL}/auth/signup`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  check(res, {
    "signup 200/201": (r) => [200, 201].includes(r.status),
  });

  if (![200, 201].includes(res.status)) fail("Erro no signup");

  const body = res.json();

  return {
    userId: body.id,
    email: body.email,
  };
}

export function login(email) {
  const payload = JSON.stringify({
    email,
    password: DEFAULT_PASSWORD,
  });

  const res = http.post(`${BASE_URL}/auth/signin`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  check(res, {
    "signin 200": (r) => r.status === 200,
  });

  if (res.status !== 200) fail("Erro no login");

  return res.json("token");
}

export function deleteUser(token, userId) {
  const res = http.del(
    `${BASE_URL}/ws/auth/deleteAccount/${userId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  check(res, {
    "delete user ok": (r) => [200, 204, 202].includes(r.status),
  });

  return res.status;
}

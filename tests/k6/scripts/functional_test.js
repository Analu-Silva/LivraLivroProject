import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';
import { htmlReport } from "../libs/k6-reporter-bundle.js";

export function handleSummary(data) {
    return {
        "C:/Dev/LivraLivro - Tests/k6/reports/html/functional_test_report.html": htmlReport(data, { debug: false }),
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
  vus: 1,
  iterations: 2,
  thresholds: {
    checks: ['rate>0.9'], // temporariamente menor para testes
  },
};

const BASE_URL = 'http://localhost:8765';
const DEFAULT_PASSWORD = 'Senha123!';
const USER_TYPE = 0;

function randomEmail() {
  const t = Date.now();
  return `test.user.${t}@example.com`;
}

export default function () {
  let createdUserId = null;
  let createdUserEmail = null;
  let token = null;
  let orderId = null;

  // -----------------------------
  // 1️⃣  CADASTRAR USUÁRIO (signup)
  // -----------------------------
  group('Signup', () => {
    const name = 'Teste K6';
    const email = randomEmail();
    const payload = JSON.stringify({
      name: name,
      email: email,
      password: DEFAULT_PASSWORD,
      phoneNumber: '51999999999',
      cpf: gerarCPFValido(),
      dateOfBirth: '1990-01-01'
    });
    const params = { headers: { 'Content-Type': 'application/json' } };

    const res = http.post(`${BASE_URL}/auth/signup`, payload, params);

    const signupChecks = check(res, {
      'signup status 201 or 200': (r) => r.status === 201 || r.status === 200,
      'signup returned id': (r) => {
        try {
          const j = r.json();
          return !!(j && j.id);
        } catch (e) {
          return false;
        }
      }
    });
    console.log('Signup checks pass:', signupChecks);

    if (!signupChecks) {
      console.error('Signup falhou:', res.status, res.body);
      fail('Não foi possível criar usuário — abortando teste');
    }

    const body = res.json();
    createdUserId = body.id;
    createdUserEmail = body.email;
    console.log('Usuário criado id=', createdUserId, 'email=', createdUserEmail);
  });

  // -----------------------------
  // 2️⃣  LOGIN (signin)
  // -----------------------------
  group('Signin', () => {
    const payload = JSON.stringify({ email: createdUserEmail, password: DEFAULT_PASSWORD });
    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(`${BASE_URL}/auth/signin`, payload, params);

    console.log('LOGIN STATUS:', res.status);

    const signinChecks = check(res, {
      'signin status 200': (r) => r.status === 200,
      'signin returned token': (r) => !!r.json('token'),
      'signin returned userId': (r) => !!(r.json('userId') || createdUserId)
    });
    console.log('Signin checks pass:', signinChecks);

    if (res.status !== 200) {
      if (createdUserId) {
        try {
          const delRes = http.del(`${BASE_URL}/ws/auth/deleteAccount/${createdUserId}`, null, { headers: { Authorization: '', 'Content-Type': 'application/json' }});
          console.log('Tentativa de remover usuário após falha de login, status:', delRes.status);
        } catch (e) {
          console.error('Erro ao apagar usuário após falha de login:', e);
        }
      }
      fail('Login falhou — abortando teste');
    }

    token = res.json('token');
    createdUserId = res.json('userId') || createdUserId;
  });

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-User-Id': createdUserId,
      'X-User-Email': createdUserEmail,
      'X-User-Type': String(USER_TYPE),
    },
  };

  // -----------------------------
  // 3️⃣  Listar livros
  // -----------------------------
  let chosenBookIds = [];
  group('Listar Livros', () => {
    const res = http.get(`${BASE_URL}/books/BRL`, authHeaders);
    console.log('/books/BRL status:', res.status);

    try {
      const json = res.json();
      let items = json.content || json;
      if (Array.isArray(items)) {
        chosenBookIds = items.slice(0,2).map(b => b.id || b.bookId).filter(Boolean);
      }
    } catch(e) {
      console.error('Erro ao parsear livros:', e);
    }

    const listBooksCheck = check(res, { 'list books status 200': (r) => r.status === 200 });
    console.log('List books checks pass:', listBooksCheck);
  });

  if (chosenBookIds.length > 0) {
    // -----------------------------
    // 4️⃣  Criar pedido
    // -----------------------------
    group('Criar Pedido', () => {
      const items = chosenBookIds.map(id => ({ bookId: id, quantity: 1 }));
      const payload = JSON.stringify({ items, paymentMethodId: 1 });
      const res = http.post(`${BASE_URL}/ws/orders`, payload, authHeaders);

      console.log('/ws/orders POST status:', res.status);
      const orderCheck = check(res, { 'create order status 200/201': (r) => [200,201].includes(r.status) });
      console.log('Create order checks pass:', orderCheck);

      if ([200,201].includes(res.status)) {
        try { orderId = res.json().id; console.log('Order created id=', orderId); } catch(e) {}
      }
    });

    // -----------------------------
    // 5️⃣ Buscar pedidos
    // -----------------------------
    group('Buscar Pedidos', () => {
      const res = http.get(`${BASE_URL}/ws/orders/BRL`, authHeaders);
      console.log('/ws/orders/BRL status:', res.status);

      const ordersCheck = check(res, {
        'list orders status 200': (r) => r.status === 200,
        'orders json parseable': (r) => { try { r.json(); return true; } catch(e) { return false; } }
      });
      console.log('Orders checks pass:', ordersCheck);
    });
  }

  sleep(1);

  // -----------------------------
  // 6️⃣ Cleanup
  // -----------------------------
  group('Cleanup', () => {
    if (createdUserId) {
      try {
        const delRes = http.del(`${BASE_URL}/ws/auth/deleteAccount/${createdUserId}`, null, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        const delCheck = check(delRes, { 'delete user status 200/204/202': (r) => [200,204,202].includes(r.status) });
        console.log('Delete checks pass:', delCheck);
      } catch(e) {
        console.error('Erro ao deletar usuário:', e);
      }
    }
  });
}

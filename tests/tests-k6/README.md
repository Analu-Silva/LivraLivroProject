# 📄 Testes de Performance – K6
## LivraLivro – QA Documentation

Este documento reúne os resultados obtidos durante a execução dos testes de **Functional**, **Load**, **Spike** e **Stress** utilizando o **k6**, com scripts executados localmente e relatórios gerados via k6-reporter.

---

## ✅ 1. Functional Test

* **Script executado:** `functional_test.js`
* **Objetivo:** validar se os principais fluxos da API funcionam corretamente.
* **Cenário:**
    * 1 VU
    * 2 iterações
    * Duração: ~6 segundos

### Resumo da Execução

| Fluxo | Resultado |
| :--- | :--- |
| Signup | Sucesso |
| Login | Sucesso |
| Listagem de livros | Sucesso |
| Criação de pedido | Sucesso |
| Listagem de pedidos | Sucesso |
| Exclusões | Sucesso |

### Saída do Console

```

Signup checks pass: true
Usuário criado id=...
LOGIN STATUS: 200
Signin checks pass: true
/books/BRL status: 200
List books checks pass: true
/books/BRL status: 200
List books checks pass: true
/ws/orders POST status: 201
Create order checks pass: true
Orders checks pass: true
Delete checks pass: true
Generating HTML summary report...

```

![Relatório de Teste Funcional](/tests-k6/functional-report.png)

---

## 🔵 2. Load Test

* **Script executado:** `load_test.js`
* **Objetivo:** medir o comportamento da API em cenários de **carga moderada e estável**.
* **Cenário:**
    * Até 10 VUs
    * Duração total: 3 minutos
    * 3 estágios (ramp-up → steady → ramp-down)

### Resumo da Execução

* **Iterações completas:** 1316
* Erros mínimos
* Sistema **estável** sob uso contínuo

### Trecho do log

```

running (3m00.7s), 00/10 VUs,
1316 complete and 0 interrupted iterations
Generating HTML summary report...

```

![Relatório de Teste de Carga](/tests-k6/load-report.png)

---

## 🔶 3. Spike Test

* **Script executado:** `spike_test.js`
* **Objetivo:** testar comportamento da API diante de **aumento súbito** de usuários.
* **Cenário:**
    * Até 100 VUs
    * Duração total: 25 segundos

### Resumo da Execução

* **Iterações completas:** 1201
* API manteve operação mesmo sob pico abrupto
* Bom indicador de **resiliência**

### Trecho do log

```

running (25.5s), 000/100 VUs,
1201 complete and 0 interrupted iterations
Generating HTML summary report...

```

![Relatório de Spike](/tests-k6/spike-report.png)

---

## 🔴 4. Stress Test

* **Script executado:** `stress_test.js`
* **Objetivo:** identificar o **ponto de quebra** do sistema e avaliar comportamento sob alta demanda prolongada.
* **Cenário:**
    * Até 150 VUs
    * Duração total: 4 minutos

### Resumo da Execução

* **Iterações completas:** 9131
* API suportou alta demanda prolongada
* Indicador de boa **escalabilidade**

### Trecho do log

```

running (4m00.6s), 000/150 VUs,
9131 complete and 0 interrupted iterations
Generating HTML summary report...

```

![Relatório de Teste de Estresse](/tests-k6/stress-report.png)

---

## 🧪 Comparativo Geral

| Teste | VUs Máx | Duração | Iterações | Resultado |
| :--- | :--- | :--- | :--- | :--- |
| Functional | 1 | ~6s | 2 | OK (1 erro em /books) |
| Load | 10 | 3m | 1316 | OK |
| Spike | 100 | 25s | 1201 | OK |
| Stress | 150 | 4m | 9131 | OK |

---

## 📌 Conclusão Geral

Os testes demonstram que:

1.  A API está **funcional** nos fluxos principais.
2.  É **estável** em carga moderada.
3.  **Resiliente** em picos de acesso.
4.  **Escalável** sob alto volume.

> **Nota:** O único ponto crítico registrado foi a inconsistência momentânea em `/books/BRL`, já identificada e documentada como bug para o backend.
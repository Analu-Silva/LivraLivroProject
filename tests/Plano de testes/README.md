# 🧾 Plano de Testes – Projeto LivraLivro

## 1. 🧭 Introdução

### 1.1 Objetivo  
Este documento tem como objetivo definir a estratégia, escopo, ambiente, cronograma e critérios de aceitação para os testes da plataforma **LivraLivro**, uma aplicação voltada à compra e venda de livros usados.  

O foco principal é garantir que o sistema funcione conforme os requisitos, oferecendo uma experiência de uso segura, estável e eficiente — tanto no **frontend** quanto no **backend**.

### 1.2 Escopo  
Serão testadas todas as funcionalidades relacionadas à **API Gateway-Service** e à interface do usuário, abrangendo:

- Requisições HTTP: `GET`, `PUT`, `POST`, `DELETE`
- Mensagens de erro e respostas do servidor
- Funcionalidades principais do backend e frontend
- Fluxos de cadastro, login, anúncio, compra e venda de livros
- Integração entre frontend e backend

**Fora de escopo (neste momento):**  
Testes de integração com meios de pagamento reais ou integrações externas ainda não implementadas.

---

## 2. 🧩 Tipos de Testes

### 2.1 Testes Funcionais  
Verificar se as funcionalidades implementadas atendem aos requisitos definidos.  
Exemplo: CRUD de anúncios, autenticação de usuários, sistema de busca e filtros.

### 2.2 Testes de Usabilidade  
Avaliar a facilidade de uso da plataforma, clareza das mensagens e eficiência dos fluxos de navegação.

### 2.3 Testes de Desempenho  
Medir o tempo de resposta, estabilidade e capacidade do sistema sob diferentes níveis de carga.

- **Teste de Carga (Load):** 30–50 usuários simultâneos em condições normais  
- **Teste de Pico (Spike):** 80–100 usuários simultâneos em períodos de maior demanda  
- **Teste de Estresse (Stress):** 150–200 usuários simultâneos para identificar o ponto de falha

### 2.4 Testes de Segurança  
Verificação de vulnerabilidades, autenticação, autorização e conformidade com boas práticas de segurança (ex.: OWASP Top 10).

---

## 3. ⚙️ Abordagem e Estratégia de Testes

Serão realizados testes **manuais e automatizados**.  

**Ferramentas utilizadas:**
- **Postman:**  
  - Testes manuais e automatizados de API  
  - Validação de respostas, status HTTP e payloads  
- **K6 (VSCode):**  
  - Testes de performance (carga, pico e estresse)

---

## 4. 🧪 Ambiente de Teste

| Recurso | Descrição |
|----------|------------|
| **Ambiente da API** | Gateway-Service |
| **Backend** | Node.js / ServeRest (execução local) + Microsserviços executados via Docker |
| **Frontend** | Versão atual do LivraLivro |
| **Ferramentas** | Postman, K6, GitHub, Docker / Docker Compose |
| **Hardware** | Capaz de simular até 200 usuários simultâneos |
| **Controle de versão** | GitHub (repositório do projeto) |

---

## 5. 📅 Cronograma

| Etapa | Atividade | Duração Estimada |
|-------|------------|------------------|
| Planejamento | Revisão de requisitos e configuração do ambiente | 2 dias |
| Execução – Testes Funcionais e de Integração | Testes manuais e automação inicial | 5 dias |
| Teste de Carga | 30–50 usuários simultâneos | 2 dias |
| Teste de Estresse | 150–200 usuários simultâneos | 2 dias |
| Teste de Pico | 80–100 usuários simultâneos | 2 dias |
| Análise e Relatórios | Consolidação de resultados e métricas | 2 dias |

---

## 6. 👥 Equipe de Projeto

| Nome | Função |
|------|--------|
| **Ana** | Líder de projeto |
| **Aline** | Gestora de projeto |
| **Alice** | Desenvolvedora Frontend |
| **Gabriel** | Desenvolvedor Backend |
| **Pedro O.** | Desenvolvedor Backend |
| **Pedro S.** | Designer UI/UX |
| **Thaise** | Analista de Requisitos |
| **Lauro** | Engenheiro de Qualidade (QA) |

---

## 7. 🧾 Critérios de Aceitação

- Todas as requisições devem retornar os **códigos HTTP esperados**  
- O **tempo de resposta** das requisições deve ser inferior a **900ms (máx. 1s)**  
- O sistema deve **manter a integridade dos dados** após operações CRUD  
- A **taxa de sucesso mínima** esperada é de **95%** em todos os testes executados

---

## 8. 📈 Métricas e Volumetria

### Métricas Relevantes
| Métrica | Valor Esperado |
|----------|----------------|
| **Tempo de Resposta Ideal** | < 900ms (máx. 1s) |
| **Throughput** | ≥ 20 requisições simultâneas |
| **Taxa de Sucesso** | ≥ 95% de sucesso, ≤ 5% de falhas |

### Volumetria
| Cenário | Usuários Simultâneos |
|----------|----------------------|
| Normal | 30–50 |
| Pico | 80–100 |
| Alta Demanda | 150–200 |

---

## 9. ⚠️ Riscos Conhecidos

- **Prazo curto** pode limitar a execução completa de todos os cenários de teste planejados  
- Dependência de **estabilidade do ambiente de testes**  
- Possíveis **atrasos na entrega de módulos backend** podem afetar a cobertura total

---

## 10. 📊 Relatórios e Entregáveis

- **Relatório diário de execução:** progresso dos testes e incidentes  
- **Relatório final de testes:** consolidação de métricas, bugs e status geral  
- **Gráficos de performance (K6):** tempo de resposta, throughput e taxa de erro  

---

## 11. 🧰 Ferramentas

| Categoria | Ferramenta |
|------------|-------------|
| Gestão de código | GitHub |
| Testes de API | Postman |
| Testes de Performance | K6 (VSCode) |
| Ambiente backend | Node.js / ServeRest |
| Containerização / Execução dos microsserviços | Docker & Docker Compose |

---

## 12. ✅ Conclusão

Este plano estabelece a base para o processo de testes da plataforma **LivraLivro**, garantindo que os principais aspectos funcionais, de desempenho e segurança sejam devidamente validados.  

O plano poderá ser revisado conforme o avanço do desenvolvimento e novas necessidades identificadas pelo time.

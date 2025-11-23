# 🧪 Testes de Performance – LivraLivro (K6)

## 📦 Instalação
```bash
npm install
```

## ▶️ Execução dos Testes
Rodar teste de carga:
```bash
npm run test:load
```

Rodar teste de pico:
```bash
npm run test:spike
```

Rodar teste de estresse:
```bash
npm run test:stress
```

## 📊 Relatórios
Após a execução, os relatórios serão gerados em:
- `k6/reports/html/` → relatórios visuais (HTML)
- `k6/reports/json/` → dados brutos para análise

## 📈 Ferramentas
- **K6** → simulação de carga
- **k6-reporter** → relatórios HTML
- **VSCode + extensão K6** → debug e execução local

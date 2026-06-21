# 📋 Sugestões de Melhorias e Funcionalidades — Projeto SOLID

Documento com propostas concretas de features, rotas, e integrações que elevariam a qualidade, observabilidade e usabilidade da API.

---

## Fase 1: Observabilidade & Infra (Essencial)

### 1.1 Health Check & Liveness Probe
**Propósito:** permitir health checks em orquestração (Docker, K8s).
- Rota: `GET /health` → `{ status: 'ok', uptime: 12345, db: 'connected' }`
- Verificar: conexão Prisma, conexão DB, uptime
- **Custo de implementação:** 🟢 Baixo (~20 min)
- **Benefício:** requisito para deploy em produção / orquestradores

### 1.2 Métricas Prometheus
**Propósito:** instrumentar contadores de negócio e latência.
- Rota: `GET /metrics` → formato Prometheus
- Contadores:
  - `app_user_registrations_total` (incrementar em `register-use-case`)
  - `app_check_ins_total` (incrementar em `check-in-use-case`)
  - `app_check_in_validations_total`
  - `http_request_duration_seconds` (histograma de latência por rota)
  - `app_errors_total` (por tipo: not-found, validation, etc.)
- Integrações posteriores: Grafana/AlertManager
- **Custo de implementação:** 🟡 Médio (~60 min com library `prom-client`)
- **Benefício:** visibilidade em produção; alertas de anomalias

### 1.3 Structured Logging (JSON)
**Propósito:** simplificar análise em centralizadores (ELK, Datadog).
- Substituir `console.log` por estruturado: `{ level, timestamp, message, userId, route, error }`
- Usar biblioteca: `pino` ou `winston`
- Aplicar em: use-cases, middlewares, error handler
- **Custo de implementação:** 🟡 Médio (~90 min)
- **Benefício:** rastreamento de bugs em produção; auditoria

---

## Fase 2: Funcionalidades de Administração

### 2.1 Admin Dashboard — Endpoints de Estatísticas
**Propósito:** permitir admins monitorar métricas de negócio.
- Rotas (todas requerem role `admin`):
  - `GET /admin/stats` → `{ totalUsers, totalGyms, totalCheckIns, avgCheckInsPerDay, topGyms[] }`
  - `GET /admin/users?page=1&limit=20` → listar usuários com paginação
  - `GET /admin/users/:userId` → detalhes do usuário + histórico
  - `GET /admin/gyms?page=1&limit=20` → listar academias
  - `GET /admin/check-ins?fromDate=...&toDate=...&gymId=...` → filtrar check-ins
- **Custo de implementação:** 🟡 Médio (~120 min)
- **Benefício:** visibilidade de negócio; suporte a clientes

### 2.2 User Management — Soft Delete & Roles
**Propósito:** permitir admins gerenciar usuários e permissões.
- Adicionar campo `deletedAt` em `User` (soft delete)
- Rotas:
  - `PATCH /admin/users/:userId/role` → mudar role (admin/user)
  - `DELETE /admin/users/:userId` → soft delete + audit log
  - `GET /admin/users/:userId/audit` → histórico de ações (who changed what, when)
- **Custo de implementação:** 🟡 Médio (~90 min + migration)
- **Benefício:** conformidade; rastreamento

### 2.3 Gym Management — Advanced Filters
**Propósito:** permitir admins buscar academias com filtros.
- Adicionar campos: `city`, `state`, `zipCode`, `phone`, `website`, `description`
- Rotas:
  - `GET /gyms?city=...&state=...&radius=...` → busca avançada
  - `PATCH /admin/gyms/:gymId` → editar academia (admin only)
  - `DELETE /admin/gyms/:gymId` → soft delete
- **Custo de implementação:** 🟡 Médio (~80 min + migration)
- **Benefício:** experiência melhor; dados mais ricos

---

## Fase 3: Funcionalidades de Usuário

### 3.1 Profile Management
**Propósito:** permitir usuários editar seu perfil.
- Rotas:
  - `PATCH /users/profile` → atualizar nome, email (validar duplicatas), foto
  - `POST /users/change-password` → mudar senha (verificar senha antiga)
  - `POST /users/delete-account` → deletar conta + dados (soft delete)
- **Custo de implementação:** 🟡 Médio (~80 min)
- **Benefício:** controle do usuário; LGPD/GDPR compliance

### 3.2 Check-in Favorites / Preferred Gyms
**Propósito:** usuários marcarem academias favoritas.
- Adicionar tabela `UserGymPreference` (userId, gymId, isFavorite, lastVisit)
- Rotas:
  - `POST /gyms/:gymId/favorite` → marcar como favorita
  - `DELETE /gyms/:gymId/favorite` → desmarcar
  - `GET /gyms/favorites` → listar favoritas + sorted by lastVisit
- **Custo de implementação:** 🟡 Médio (~70 min + migration)
- **Benefício:** UX melhorada; dados para recomendações futuras

### 3.3 Check-in Notifications / Reminders
**Propósito:** notificar usuários de check-ins próximos ou lembretes.
- Adicionar tabela `UserNotificationPreference` (userId, emailOnCheckIn, pushOnReminder, etc.)
- Integração: gerar notificações em background job (Bull/RabbitMQ)
- Rotas:
  - `PATCH /users/notification-preferences` → configurar
  - `GET /users/notifications` → histórico de notificações
- **Custo de implementação:** 🔴 Alto (~180 min + queue setup)
- **Benefício:** engagement; retenção de usuário

---

## Fase 4: API Pública & Documentação

### 4.1 OpenAPI / Swagger
**Propósito:** documentação automática e interativa das rotas.
- Usar: `@fastify/swagger` + `@fastify/swagger-ui`
- Decorar rotas com `zod-to-openapi` para gerar spec automática
- Servir em: `GET /docs` e `GET/api-docs.json`
- **Custo de implementação:** 🟡 Médio (~100 min)
- **Benefício:** onboarding de desenvolvedores; ferramentas (Postman, etc.)

### 4.2 API Rate Limiting
**Propósito:** proteger API de abuso.
- Usar: `@fastify/rate-limit`
- Limites: 100 req/min por IP; 1000 req/min por usuário autenticado
- Rota whitelist: `/health`, `/docs`
- **Custo de implementação:** 🟢 Baixo (~30 min)
- **Benefício:** resiliência; proteção contra bots

### 4.3 API Versioning
**Propósito:** suportar múltiplas versões de API em paralelo.
- Estrutura: `/v1/users`, `/v2/users` (com breaking changes)
- Usar header: `Accept: application/vnd.api+json;version=2`
- **Custo de implementação:** 🟡 Médio (~60 min refactor)
- **Benefício:** evolução sem quebrar clientes antigos

---

## Fase 5: Performance & Escalabilidade

### 5.1 Caching Layer (Redis)
**Propósito:** cachear queries frequentes (lista de academias, perfil de usuário).
- Usar: `@fastify/redis` + `redis` library
- Cache: GET /gyms (5 min TTL), GET /users/profile (10 min), POST /check-in (invalidar)
- **Custo de implementação:** 🟡 Médio (~90 min + docker-compose)
- **Benefício:** latência reduzida; economia de DB

### 5.2 Pagination Optimization
**Propósito:** garantir queries eficientes em grandes datasets.
- Implementar: cursor-based pagination (além de offset-limit)
- Índices no DB: (userId, createdAt), (gymId, createdAt)
- **Custo de implementação:** 🟡 Médio (~80 min)
- **Benefício:** performance em escala; queries mais eficientes

### 5.3 Async Job Queue (Bull)
**Propósito:** processar tasks pesadas fora do request-response.
- Exemplo: enviar emails, gerar relatórios, sincronizar dados
- Setup: Bull + Redis
- **Custo de implementação:** 🟡 Médio (~120 min + infra)
- **Benefício:** requisições mais rápidas; reliability

---

## Fase 6: Segurança & Compliance

### 6.1 Input Validation Hardening
**Propósito:** evitar SQL injection, XSS, etc.
- Expandir Zod schemas com regras mais rigorosas (email format, length limits)
- Sanitizar strings de entrada (remover `<>` perigosos)
- **Custo de implementação:** 🟢 Baixo (~40 min)
- **Benefício:** reduzir surface de ataque

### 6.2 HTTPS & CORS
**Propósito:** segurança em trânsito e controle de origem.
- Configurar CORS whitelist em produção
- Force HTTPS em produção
- **Custo de implementação:** 🟢 Baixo (~30 min)
- **Benefício:** conformidade; segurança

### 6.3 Audit Log
**Propósito:** registrar mudanças críticas (deletar usuário, validar check-in, etc.).
- Adicionar tabela `AuditLog` (actor, action, resource, timestamp, changes)
- Trigger em use-cases críticos
- **Custo de implementação:** 🟡 Médio (~80 min)
- **Benefício:** conformidade; investigação de incidentes

### 6.4 Two-Factor Authentication (2FA)
**Propósito:** aumentar segurança de autenticação.
- Usar: TOTP (Google Authenticator) ou SMS
- Opcional por usuário
- **Custo de implementação:** 🔴 Alto (~200 min)
- **Benefício:** segurança aumentada; proteção de contas

---

## Tabela Resumida de Priorização

| ID  | Feature | Fase | Custo | Benefício | Prioridade |
|-----|---------|------|-------|-----------|------------|
| 1.1 | Health Check | 1 | 🟢 | Essencial | 🔴 Alta |
| 1.2 | Prometheus Metrics | 1 | 🟡 | Observabilidade | 🔴 Alta |
| 1.3 | Structured Logging | 1 | 🟡 | Debug/Auditoria | 🟠 Média |
| 2.1 | Admin Stats Dashboard | 2 | 🟡 | Negócio | 🟠 Média |
| 2.2 | User Management | 2 | 🟡 | Compliance | 🟠 Média |
| 2.3 | Gym Advanced Filters | 2 | 🟡 | UX | 🟡 Baixa |
| 3.1 | Profile Management | 3 | 🟡 | UX | 🟠 Média |
| 3.2 | Favorite Gyms | 3 | 🟡 | UX | 🟡 Baixa |
| 3.3 | Check-in Notifications | 3 | 🔴 | Engagement | 🟡 Baixa |
| 4.1 | OpenAPI/Swagger | 4 | 🟡 | DX | 🟠 Média |
| 4.2 | Rate Limiting | 4 | 🟢 | Segurança | 🟠 Média |
| 4.3 | API Versioning | 4 | 🟡 | Evoluibilidade | 🟡 Baixa |
| 5.1 | Redis Caching | 5 | 🟡 | Performance | 🟠 Média |
| 5.2 | Pagination Optimization | 5 | 🟡 | Performance | 🟡 Baixa |
| 5.3 | Async Job Queue | 5 | 🟡 | Reliability | 🟠 Média |
| 6.1 | Input Validation | 6 | 🟢 | Segurança | 🟠 Média |
| 6.2 | HTTPS/CORS | 6 | 🟢 | Segurança | 🔴 Alta |
| 6.3 | Audit Log | 6 | 🟡 | Compliance | 🟠 Média |
| 6.4 | 2FA Authentication | 6 | 🔴 | Segurança | 🟡 Baixa |

---

## Roadmap Sugerido (6-8 semanas)

### Semana 1-2: Foundation (Fases 1 + início 4)
- [x] Health Check (1.1)
- [ ] Prometheus Metrics (1.2)
- [ ] Rate Limiting (4.2)
- [ ] HTTPS/CORS hardening (6.2)

### Semana 3-4: Admin & User Features (Fase 2-3)
- [ ] Admin Stats Dashboard (2.1)
- [ ] User Management (2.2)
- [ ] Profile Management (3.1)

### Semana 5-6: API Polish (Fase 4 + 6)
- [ ] OpenAPI/Swagger (4.1)
- [ ] Structured Logging (1.3)
- [ ] Audit Log (6.3)

### Semana 7-8: Performance & Advanced (Fase 5 + extras)
- [ ] Redis Caching (5.1)
- [ ] Async Job Queue (5.3)
- [ ] Input Validation Hardening (6.1)

---

## Como Contribuir

1. Escolha uma feature da tabela acima
2. Criar branch: `feature/health-check` ou `improvement/metrics`
3. Implementar com testes (unit + e2e)
4. Abrir PR com descrição clara
5. Merged e deploy!

---

## Links & Referências

- [Prometheus Node.js Client](https://github.com/siimon/prom-client)
- [Fastify Health Check Plugin](https://github.com/fastify/fastify-health-check)
- [Zod Validation Guide](https://zod.dev)
- [OpenAPI / Swagger Setup](https://docs.fastify.io/latest/docs/swagger/)
- [OWASP Security Best Practices](https://owasp.org/)

---

**Última atualização:** 2026-06-20

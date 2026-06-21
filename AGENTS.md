# AGENTS.md — Instruções rápidas para agentes

Propósito
- Fornecer um resumo mínimo e acionável que ajude agentes AI (Copilot / Bots) a entender, construir e testar este repositório rapidamente.
- Linkar documentação existente em vez de duplicá-la.

Quick-start (setup mínimo)
- Levantar DB: `docker compose up -d`  (arquivo: [docker-compose.yml](docker-compose.yml))
- Instalar dependências: `npm install`
- Gerar/migrar prisma: `npm run db:generate` / `npm run db:migrate`
- Rodar em dev: `npm run start:dev` (usa `tsx watch` — ver [package.json](package.json))

Comandos úteis
- Build: `npm run build` → output em `dist/`
- Start (prod): `npm run start`
- Testes unitários: `npm run test`
- Testes E2E: `npm run test:e2e` (requer Docker/DB)
- Cobertura: `npm run test:coverage`
- Lint/Format: `npm run lint`, `npm run format`

Pontos de entrada (runtime)
- Servidor: [src/server.ts](src/server.ts)
- Definição de app/rotas: [src/app.ts](src/app.ts)
- Arquivo raiz auxiliar: [index.ts](index.ts)

Arquitetura e limites principais
- HTTP (controllers, middlewares): [src/http](src/http)
- Casos de uso (business logic): [src/use-cases](src/use-cases)
- Interfaces (contratos de repositório): [src/interfaces](src/interfaces)
- Repositórios (in-memory para testes / prisma para produção): [src/repositories/in-memory](src/repositories/in-memory) e [src/repositories/prisma](src/repositories/prisma)
- Prisma schema & test env: [prisma/schema.prisma](prisma/schema.prisma) e [prisma/vitest-environment-prisma/prisma-test-environment.ts](prisma/vitest-environment-prisma/prisma-test-environment.ts)

Convenções importantes
- Separação SOLID: controllers → use-cases → repositories (via interfaces)
- Fabrics de use-cases em `src/use-cases/factories/*` fazem o _wiring_
- Fastify + Zod (validadores) usados nas rotas
- `InMemory` usado nos testes unitários; `Prisma*Repository` no runtime
- Testes E2E gerenciam um schema Prisma isolado por execução

Erros comuns / armadilhas para agentes
- Falta de `DATABASE_URL` ou variáveis JWT no ambiente impede testes/execução
- Testes E2E requerem Docker e o script de ambiente Prisma — siga os scripts em `package.json`
- Lembre de rodar `npm run db:generate` após alterar `prisma/schema.prisma`

Sugestões rápidas de melhorias (priorizadas)
- Adicionar `.env.example` com variáveis necessárias (`DATABASE_URL`, `JWT_SECRET_KEY`, `JWT_EXP_IN`, `PORT`)
- Health-check e métricas (endpoint `/health` e `/metrics`) com Prometheus (expor contadores de check-ins/erros/latência)
- Endpoint de administração para listar usuários e estatísticas (paginação + filtro)
- Adicionar OpenAPI / Swagger para documentação automática das rotas principais
- Monitoramento de performance básico (instrumentar handlers de use-case com timers)

Tarefas de agente recomendadas
- `create-.env-example`: criar `.env.example` com valores placeholder
- `update-readme-quickstart`: adicionar passos claros de setup ao [README.md](README.md)
- `add-health-metrics`: implementar `/health` e `/metrics` e testes E2E correspondentes
- `add-openapi`: gerar spec básica e servir em `/docs`

Próximos passos sugeridos ao humano
- Confirme se prefere `AGENTS.md` (este arquivo) ou também uma `.github/copilot-instructions.md` mais curta
- Quer que eu crie `.env.example` e atualize o `README.md` agora?

Links úteis
- [package.json](package.json)
- [README.md](README.md)
- [docker-compose.yml](docker-compose.yml)
- [src/server.ts](src/server.ts) | [src/app.ts](src/app.ts)
- [prisma/schema.prisma](prisma/schema.prisma)

(Arquivo gerado automaticamente para melhorar a produtividade de agentes.)

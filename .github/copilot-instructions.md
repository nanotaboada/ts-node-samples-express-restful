# GitHub Copilot Instructions

> **⚡ Token Efficiency Note**: This is a minimal pointer file (~500 tokens, auto-loaded by Copilot).
> For complete operational details, reference: `#file:AGENTS.md` (~2,500 tokens, loaded on-demand)
> For specialized knowledge, use: `#file:SKILLS/<skill-name>/SKILL.md` (loaded on-demand when needed)

## 🎯 Quick Context

**Project**: Express.js REST API with TypeScript and native ESM
**Stack**: Node.js 24 • Express 5 • TypeScript • Sequelize • SQLite • Docker
**Pattern**: Routes → Controllers → Services → ORM (layered)
**Philosophy**: Learning-focused PoC with modern TypeScript and ESM

## 📐 Core Conventions

- **Module System**: Native ESM (require `.js` in imports!)
- **Naming**: camelCase (variables/functions), PascalCase (classes/types)
- **Type Safety**: Strict TypeScript, no `any` without justification
- **Async**: All I/O operations use async/await
- **Testing**: Jest with ESM experimental VM modules
- **Formatting**: Prettier (4 spaces, single quotes, 127 width)

## 🏗️ Architecture at a Glance

```
Route → Controller → Service → Sequelize → Database
  ↓         ↓            ↓
Cache   Validation   Transaction
```

- **Routes**: Express router with middleware
- **Controllers**: Request/response handling
- **Services**: Business logic with Sequelize ORM
- **Models**: Sequelize models with TypeScript types
- **Cache**: node-cache (1-hour TTL)

## ✅ Copilot Should

- Generate TypeScript with proper types and interfaces
- Use ESM imports with `.js` extensions (mandatory!)
- Follow Express async/await patterns correctly
- Write Jest tests with proper ESM configuration
- Apply Sequelize models and migrations correctly
- Use Helmet and CORS for security
- Implement proper error handling with try/catch

## 🚫 Copilot Should Avoid

- Using `any` type without reason
- Missing `.js` in relative imports (ESM requirement!)
- Mixing CommonJS (`require`) with ESM (`import`)
- Synchronous file operations
- Missing error handling on async operations
- Using `console.log` instead of proper logging

## ⚡ Quick Commands

```bash
# Run with hot reload
npm run dev

# Test with coverage
npm test

# Docker
docker compose up

# Swagger: http://localhost:9000/api-docs
```

## 📚 Need More Detail?

**For operational procedures**: Load `#file:AGENTS.md`
**For Docker expertise**: *(Planned)* `#file:SKILLS/docker-containerization/SKILL.md`
**For testing patterns**: *(Planned)* `#file:SKILLS/testing-patterns/SKILL.md`

---

💡 **Why this structure?** Copilot auto-loads this file on every chat (~500 tokens). Loading `AGENTS.md` or `SKILLS/` explicitly gives you deep context only when needed, saving 80% of your token budget!

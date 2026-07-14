# Клуб дзюдо «Локомотив» — сайт + CMS

Единое Next.js 15 приложение с встроенной админкой Payload CMS 3 на `/admin`.
Стек: Next.js 15 (App Router, TS) · Payload CMS 3.86 · PostgreSQL 16 · Tailwind CSS 4 · Caddy 2 · Docker Compose.

План разработки и фазы — в [PLAN.md](PLAN.md).

## Структура

```
src/
  app/(frontend)/     — публичный сайт (Tailwind)
  app/(payload)/      — админка и REST/GraphQL API Payload
  collections/        — коллекции Payload (Users, Media; расширяются в Фазе 1)
  payload.config.ts   — конфиг Payload (Postgres, сидинг админа)
Dockerfile            — multi-stage сборка приложения
docker-compose.yml    — app + postgres + caddy
Caddyfile             — реверс-прокси и авто-TLS
deploy.sh             — деплой на VPS
```

## Деплой на VPS

1. Скопировать проект на сервер и создать `.env` из `.env.example`:
   ```bash
   cp .env.example .env && nano .env   # заполнить секреты
   ```
2. Запустить:
   ```bash
   ./deploy.sh
   ```
   Скрипт соберёт образ, поднимет контейнеры и дождётся ответа приложения.

### Режимы `SITE_ADDRESS` (в `.env`)

| Значение | Поведение |
|---|---|
| `:80` | HTTP без сертификата — smoke-тест по IP, пока DNS не настроен |
| `chickenflow.ru` | авто-HTTPS (Let's Encrypt), когда A-запись домена указывает на VPS |
| `jcloko.ru` | боевой домен |

Первый администратор создаётся автоматически при первом старте с пустой БД
из `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.

## Разработка

`npm run dev` поднимает сайт и `/admin` локально (нужен доступный PostgreSQL в `DATABASE_URL`).
`npm run lint` · `npm run typecheck` · `npm run build` — те же проверки, что и в CI.

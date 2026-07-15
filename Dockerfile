# syntax=docker/dockerfile:1

# --- base -------------------------------------------------------------------
FROM node:22-alpine AS base
# libc6-compat нужен sharp (нативные бинарники) на alpine/musl;
# ffmpeg — для транскода видео в WebM и генерации постера.
RUN apk add --no-cache libc6-compat ffmpeg
WORKDIR /app

# --- deps -------------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
# Кэш npm сохраняется между сборками (BuildKit) — быстрее при смене зависимостей.
RUN --mount=type=cache,target=/root/.npm npm ci

# --- build ------------------------------------------------------------------
FROM base AS build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# importMap и типы Payload уже сгенерированы и закоммичены (регенерируются в
# pre-check/CI), поэтому в Docker-сборке их не пересоздаём — экономим ~20–30с.
# Кэш компиляции Next (.next/cache) сохраняется между сборками (BuildKit).
RUN --mount=type=cache,target=/app/.next/cache npm run build

# --- runner -----------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--no-deprecation
ENV PORT=3000

RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
# Публичные ассеты (в т.ч. загруженные из репо PDF) должны быть читаемы
# пользователем nextjs независимо от исходных прав файла.
RUN chmod -R a+rX ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/src ./src

# каталог для загрузок (сюда монтируется том media)
RUN mkdir -p /app/media && chown -R nextjs:nodejs /app/media /app/.next

USER nextjs
EXPOSE 3000
# На старте применяем миграции Payload (идемпотентно), затем поднимаем Next.
# Так свежий деплой на пустую БД сам создаёт схему. NODE_OPTIONS задан выше.
CMD ["sh", "-c", "node_modules/.bin/payload migrate && node_modules/.bin/next start"]

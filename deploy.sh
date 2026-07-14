#!/usr/bin/env bash
#
# Деплой на VPS из готового образа (собран в CI и запушен в GHCR).
# Запускать в /opt/judo на сервере. Требует заполненный .env (в т.ч. APP_IMAGE).
#
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "ОШИБКА: нет .env" >&2
  exit 1
fi

echo "==> docker compose pull app"
docker compose pull app

echo "==> docker compose up -d"
docker compose up -d

echo "==> очистка старых образов"
docker image prune -f >/dev/null 2>&1 || true

echo "==> ожидание готовности приложения"
for i in $(seq 1 40); do
  if docker compose exec -T caddy wget -q -O /dev/null http://app:3000/ 2>/dev/null; then
    echo "OK: приложение отвечает"
    exit 0
  fi
  sleep 3
done

echo "ВНИМАНИЕ: приложение не ответило вовремя — смотрите: docker compose logs --tail=100 app" >&2
exit 1

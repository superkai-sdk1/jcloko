#!/usr/bin/env bash
#
# Деплой на VPS. Запускать в каталоге проекта на сервере.
# Требует рядом заполненный .env (см. .env.example).
#
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "ОШИБКА: нет файла .env (скопируйте .env.example и заполните секреты)" >&2
  exit 1
fi

# Если подключён git-remote — подтянуть свежий код (иначе пропустить).
if git rev-parse --abbrev-ref --symbolic-full-name '@{u}' >/dev/null 2>&1; then
  echo "==> git pull"
  git pull --ff-only
fi

echo "==> docker compose build"
docker compose build

echo "==> docker compose up -d"
docker compose up -d

echo "==> ожидание готовности приложения"
for i in $(seq 1 60); do
  if docker compose exec -T caddy wget -q -O /dev/null http://app:3000/ 2>/dev/null; then
    echo "OK: приложение отвечает"
    exit 0
  fi
  sleep 3
done

echo "ВНИМАНИЕ: приложение не ответило за отведённое время — смотрите логи:" >&2
echo "  docker compose logs --tail=100 app" >&2
exit 1

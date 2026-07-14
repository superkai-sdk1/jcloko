#!/usr/bin/env bash
#
# Ежедневный бэкап: дамп PostgreSQL + архив медиа-тома. Ротация: 14 дневных,
# помесячные копии (1-го числа) — бессрочно. Запускать из /opt/judo.
#
set -euo pipefail
cd "$(cd "$(dirname "$0")/.." && pwd)"

BK="/opt/judo/backups"
DAILY="$BK/daily"
MONTHLY="$BK/monthly"
mkdir -p "$DAILY" "$MONTHLY"

TS="$(date +%Y%m%d_%H%M%S)"
DAY="$(date +%d)"

DB_USER="$(grep '^POSTGRES_USER=' .env | cut -d= -f2-)"
DB_NAME="$(grep '^POSTGRES_DB=' .env | cut -d= -f2-)"

echo "==> pg_dump $DB_NAME"
docker compose exec -T postgres pg_dump -U "$DB_USER" -d "$DB_NAME" | gzip > "$DAILY/db_${TS}.sql.gz"

echo "==> tar media volume"
docker run --rm -v judo_media:/media:ro -v "$DAILY":/backup alpine \
  tar czf "/backup/media_${TS}.tar.gz" -C /media . 2>/dev/null || true

# Помесячная копия 1-го числа (бессрочно)
if [ "$DAY" = "01" ]; then
  cp "$DAILY/db_${TS}.sql.gz" "$MONTHLY/" 2>/dev/null || true
  cp "$DAILY/media_${TS}.tar.gz" "$MONTHLY/" 2>/dev/null || true
fi

# Ротация: оставляем 14 последних дневных
ls -1t "$DAILY"/db_*.sql.gz 2>/dev/null | tail -n +15 | xargs -r rm -f
ls -1t "$DAILY"/media_*.tar.gz 2>/dev/null | tail -n +15 | xargs -r rm -f

echo "backup OK: $TS"
ls -lh "$DAILY" | tail -4

#!/usr/bin/env bash
#
# Восстановление БД из дампа. ОПАСНО для прод-БД — по умолчанию требует
# подтверждения. Использование:
#   ./scripts/restore.sh backups/daily/db_YYYYMMDD_HHMMSS.sql.gz [target_db]
#
set -euo pipefail
cd "$(cd "$(dirname "$0")/.." && pwd)"

DUMP="${1:?Укажите путь к дампу .sql.gz}"
DB_USER="$(grep '^POSTGRES_USER=' .env | cut -d= -f2-)"
DB_NAME="$(grep '^POSTGRES_DB=' .env | cut -d= -f2-)"
TARGET="${2:-$DB_NAME}"

if [ "$TARGET" = "$DB_NAME" ]; then
  read -r -p "Восстановить в БОЕВУЮ базу '$TARGET'? Данные будут перезаписаны. [yes/NO] " a
  [ "$a" = "yes" ] || { echo "отменено"; exit 1; }
fi

echo "==> restore $DUMP -> $TARGET"
gunzip -c "$DUMP" | docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$TARGET"
echo "restore OK"

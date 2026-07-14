#!/usr/bin/env bash
#
# Проверка восстановимости бэкапа: восстанавливает последний (или указанный)
# дамп во ВРЕМЕННУЮ базу, считает строки ключевых таблиц и удаляет её.
# Боевую БД не трогает. Запускать из /opt/judo.
#
set -euo pipefail
cd "$(cd "$(dirname "$0")/.." && pwd)"

DB_USER="$(grep '^POSTGRES_USER=' .env | cut -d= -f2-)"
DUMP="${1:-$(ls -1t backups/daily/db_*.sql.gz 2>/dev/null | head -1)}"
[ -n "${DUMP:-}" ] && [ -f "$DUMP" ] || { echo "Нет дампа для проверки"; exit 1; }

SCRATCH="judo_verify_$(date +%s)"
psql() { docker compose exec -T postgres psql -U "$DB_USER" "$@"; }

echo "==> проверяем дамп: $DUMP"
psql -d postgres -c "DROP DATABASE IF EXISTS $SCRATCH;" >/dev/null
psql -d postgres -c "CREATE DATABASE $SCRATCH OWNER $DB_USER;" >/dev/null

cleanup() { psql -d postgres -c "DROP DATABASE IF EXISTS $SCRATCH;" >/dev/null 2>&1 || true; }
trap cleanup EXIT

echo "==> восстановление во временную базу $SCRATCH"
gunzip -c "$DUMP" | docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$SCRATCH" >/dev/null

echo "==> строки ключевых таблиц в восстановленной базе:"
ok=1
for t in users news pages coaches schedule_entries; do
  c="$(psql -d "$SCRATCH" -t -c "SELECT count(*) FROM $t;" 2>/dev/null | tr -d ' ')"
  printf "   %-18s %s\n" "$t" "${c:-ERR}"
  [ -n "$c" ] || ok=0
done

[ "$ok" = 1 ] && echo "VERIFY-RESTORE OK" || { echo "VERIFY-RESTORE FAILED"; exit 1; }

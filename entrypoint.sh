#!/bin/sh
set -e

# ── Esperar a PostgreSQL ──────────────────────────────────────────────────────
echo "[EPD] Esperando a PostgreSQL en ${DB_HOST}:${DB_PORT:-5432}..."
until python -c "
import psycopg2, os, sys
try:
    psycopg2.connect(
        dbname=os.environ.get('DB_NAME', 'paladar'),
        user=os.environ.get('DB_USER', 'paladar'),
        password=os.environ.get('DB_PASSWORD', ''),
        host=os.environ.get('DB_HOST', 'db'),
        port=os.environ.get('DB_PORT', '5432'),
    )
    sys.exit(0)
except Exception as e:
    sys.exit(1)
"; do
  printf '.'
  sleep 1
done
echo ""
echo "[EPD] PostgreSQL listo."

# ── Migraciones ───────────────────────────────────────────────────────────────
# migrate_schemas --shared aplica las migraciones del schema público (SHARED_APPS).
# Las migraciones de tenant se aplican automáticamente al crear cada restaurante.
echo "[EPD] Aplicando migraciones del schema público..."
python manage.py migrate_schemas --shared --noinput

echo "[EPD] Servidor listo."
exec "$@"

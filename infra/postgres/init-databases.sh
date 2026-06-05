#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" <<-EOSQL

SELECT 'CREATE DATABASE local_ai_auth'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'local_ai_auth'
)\gexec

SELECT 'CREATE DATABASE local_ai_user'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'local_ai_user'
)\gexec

EOSQL
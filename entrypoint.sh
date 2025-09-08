#!/bin/sh
set -e

# Ensure DB folder exists
mkdir -p /app/data
mkdir -p /app/backups

# Run migrations if DB doesn't exist
echo "📦 Checking database..."
if [ ! -f "/app/data/db.sqlite3" ]; then
  echo "🆕 No database found. Running migrations..."
  python manage.py makemigrations --noinput
  python manage.py migrate --noinput

  echo "👤 Creating superuser..."
  python manage.py shell -c "from django.contrib.auth import get_user_model; import os; User = get_user_model(); \
    User.objects.create_superuser(os.environ.get('DJANGO_SUPERUSER_USERNAME'), \
    os.environ.get('DJANGO_SUPERUSER_EMAIL','admin@example.com'), \
    os.environ.get('DJANGO_SUPERUSER_PASSWORD'))"
else
  echo "✅ Database exists, skipping migrations."
fi

# Start backup in background
echo "💾 Starting daily DB backup..."
mkdir -p /app/backups
sh -c "while true; do
  if [ -f /app/data/db.sqlite3 ]; then
    cp /app/data/db.sqlite3 /app/backups/db-$(date +%F-%H-%M-%S).sqlite3
    find /app/backups -type f -mtime +7 -delete
  fi
  sleep 86400
done" &

# Start Gunicorn
echo "🚀 Starting Gunicorn..."
exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 2

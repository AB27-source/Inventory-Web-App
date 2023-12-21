#!/bin/bash

echo "Installing dependencies..."
python3.10 -m pip install --upgrade pip
python3.10 -m pip install -r requirements.txt

echo "Migrating database..."

python3.10 manage.py makemigrations --noinput
python3.10 manage.py migrate --noinput

echo "Creating superuser..."

export DJANGO_SUPERUSER_EMAIL=${SUPERUSER_EMAIL}
export DJANGO_SUPERUSER_USERNAME=${SUPERUSER_USERNAME}
export DJANGO_SUPERUSER_PASSWORD=${EMAIL_HOST_PASSWORD}

python3.10 manage.py createsuperuser --noinput
python3.10 manage.py runscript load_courses

echo "Collecting static files..."

python3.10 manage.py collectstatic --noinput
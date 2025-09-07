FROM python:3.11-bullseye

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set timezone right away
ENV TZ=Asia/Kolkata

WORKDIR /app

# Install deps
COPY ./requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY backend /app

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

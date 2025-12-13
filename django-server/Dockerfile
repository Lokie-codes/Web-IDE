# ============================================
# Django Server - Optimized Multi-Stage Build
# ============================================

# Stage 1: Builder stage for dependencies
FROM python:3.12-slim AS builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy and install requirements
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    pip install gunicorn psycopg2-binary

# ============================================
# Stage 2: Production stage
# ============================================
FROM python:3.12-slim AS production

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    DJANGO_SETTINGS_MODULE=codeforge_server.settings

WORKDIR /app

# Install only runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create non-root user
RUN groupadd -r django && useradd -r -g django djangouser

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv

# Copy application code
COPY --chown=djangouser:django . .

# Create static and media directories
RUN mkdir -p /app/staticfiles /app/mediafiles && \
    chown -R djangouser:django /app

# Switch to non-root user
USER djangouser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Run migrations (--fake-initial handles existing tables from other services) and start gunicorn
CMD ["sh", "-c", "python manage.py migrate --fake-initial --noinput && gunicorn codeforge_server.wsgi:application --bind 0.0.0.0:8000 --workers 2 --threads 4 --worker-class gthread --access-logfile - --error-logfile -"]
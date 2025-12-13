# ============================================
# Spring Boot Server - Optimized Multi-Stage Build
# ============================================

# Stage 1: Dependency caching stage
FROM maven:3.9-eclipse-temurin-21-alpine AS deps

WORKDIR /app

# Copy only pom.xml first for dependency caching
COPY pom.xml .

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# ============================================
# Stage 2: Build stage
# ============================================
FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Copy cached dependencies from deps stage
COPY --from=deps /root/.m2 /root/.m2

# Copy pom.xml and source
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -B && \
    # Extract layered JAR for better caching
    mkdir -p target/extracted && \
    java -Djarmode=layertools -jar target/*.jar extract --destination target/extracted || true

# ============================================
# Stage 3: Production stage
# ============================================
FROM eclipse-temurin:21-jre-alpine AS production

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S spring && \
    adduser -S springuser -u 1001 -G spring

# Create data directory
RUN mkdir -p /app/data && \
    chown -R springuser:spring /app

# Copy JAR from build stage
COPY --from=build --chown=springuser:spring /app/target/server-0.0.1-SNAPSHOT.jar app.jar

# Switch to non-root user
USER springuser

# Expose port
EXPOSE 8080

# JVM optimization flags for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:InitialRAMPercentage=50.0 \
    -Djava.security.egd=file:/dev/./urandom \
    -Dspring.profiles.active=production"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Start the application with optimized JVM settings
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

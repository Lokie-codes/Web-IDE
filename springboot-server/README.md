# Spring Boot Server for Online IDE

A Spring Boot implementation of the backend server.

## Prerequisites
- Java 21 or higher
- Maven (optional, wrapper can be used if added)

## Running
1. Navigate to this directory.
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   Or if you don't have maven in path but have the wrapper (I didn't include it due to size/download restrictions):
   You can open this project in IntelliJ IDEA or Eclipse and run `ServerApplication`.

## Configuration
See `src/main/resources/application.properties` for configuration.
Default port: 8080 (changed from 3001 to avoid conflict, configurable).
API Base Path: `/api`

## Endpoints
- `GET /api/health`
- `POST /api/execute`
- `GET /api/execute/runtimes`
- `POST /api/ai/complete`
- `POST /api/ai/explain`
- `GET /api/gists`
- `POST /api/gists`
- `GET /api/gists/{id}`
- `PUT /api/gists/{id}`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/{id}`
- `POST /api/projects/{id}/files`
- `PUT /api/projects/{pid}/files/{fid}`
- `DELETE /api/projects/{pid}/files/{fid}`

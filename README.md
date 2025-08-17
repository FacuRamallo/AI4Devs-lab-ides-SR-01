# LTI - Sistema de Seguimiento de Talento

Este proyecto es una aplicación full-stack diseñada para gestionar el seguimiento de candidatos en un proceso de selección. Combina un frontend desarrollado en React con un backend en Express, utilizando Prisma como ORM y PostgreSQL como base de datos.

## Flujo de Uso del Proyecto

1. **Añadir Candidato**: Los usuarios pueden añadir un nuevo candidato proporcionando información básica como nombre, correo electrónico, teléfono y dirección. También pueden subir un archivo de CV en formato PDF o DOCX.
2. **Subida de CV**: El CV del candidato se almacena en un bucket S3 simulado utilizando LocalStack.
3. **Gestión de Datos**: Los datos del candidato se almacenan en una base de datos PostgreSQL gestionada a través de Prisma.

## Cómo Ejecutar el Proyecto

### Requisitos Previos

- Docker y Docker Compose instalados.
- Node.js y npm instalados.

### Pasos para Ejecutar

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd AI4Devs-lab-ides-SR-01
   ```

2. Inicia los servicios de Docker:
   ```bash
   docker-compose up -d
   ```
   Esto iniciará los servicios de PostgreSQL y LocalStack necesarios para el proyecto.

3. Instala las dependencias del backend y frontend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

4. Inicia el backend en modo producción:
   ```bash
   cd backend
   npm run start:prod
   ```

5. Inicia el frontend:
   ```bash
   cd frontend
   npm start
   ```

El backend estará disponible en `http://localhost:3010` y el frontend en `http://localhost:3000`.

## Cómo Ejecutar las Pruebas

### Backend

1. **Pruebas Unitarias**:
   ```bash
   cd backend
   npm run test
   ```

2. **Iniciar el Backend en Producción**:
   ```bash
   npm run start:prod
   ```

### Frontend

1. **Pruebas Unitarias**:
   ```bash
   cd frontend
   npm run test
   ```

2. **Iniciar el Frontend**:
   ```bash
   npm start
   ```
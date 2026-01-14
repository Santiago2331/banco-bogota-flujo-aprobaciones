# Sistema de Flujo de Aprobaciones - Banco Bogotá

## Descripción del Proyecto
Aplicación web fullstack desarrollada para el reto técnico del Banco Bogotá. Sistema de gestión de flujos de aprobación genéricos para el CoE de Desarrollo.

## Objetivos Cumplidos
 **Crear solicitudes** con título, descripción, solicitante, responsable y tipo  
 **Notificar al aprobador** mediante interfaz de usuario  
 **Aprobar/Rechazar** solicitudes con comentarios  
 **Guardar histórico** completo de cambios  
 **Generar ID único** por solicitud (UUID)  

## Arquitectura Técnica

### **Frontend**
- HTML5, CSS3, JavaScript ES6+
- Arquitectura MVC puro (sin frameworks)
- Fetch API para comunicación REST
- CSS Grid/Flexbox responsive

### **Backend**
- Node.js + Express.js
- PostgreSQL + node-postgres
- API REST con CORS habilitado

### **Base de Datos**
- PostgreSQL 15 (Docker)
- Tablas: `solicitudes`, `historico_solicitudes`

### **Herramientas**
- Git + GitHub
- Docker Desktop
- Postman (pruebas API)

##  Estructura del Proyecto

flujo-aprobaciones/
├── backend/ # API Server
│ ├── controllers/ # Controladores API
│ ├── routes/ # Rutas REST
│ ├── services/ # Lógica de negocio
│ ├── app.js # Servidor principal
│ ├── database.js # Conexión PostgreSQL
│ └── package.json # Dependencias
├── frontend/ # Aplicación Web
│ ├── css/ # Estilos
│ ├── js/ # Código JavaScript
│ │ ├── controllers/ # Controladores MVC
│ │ ├── models/ # Modelos de datos
│ │ ├── services/ # Servicios API
│ │ ├── views/ # Vistas UI
│ │ └── app.js # Inicialización
│ ├── index.html # Página principal
│ └── package.json # Dependencias frontend
├── database/ # Configuración BD
│ └── init.sql # Script inicialización
├── .gitignore # Archivos ignorados
└── README.md # Esta documentación

## Instalación Rápida

### **1. Base de Datos (Docker)**
```bash
# Ejecutar PostgreSQL
docker run -d --name aprobaciones-db \
  -e POSTGRES_DB=aprobaciones_db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -p 5432:5432 \
  postgres:15

  # Conectar a PostgreSQL
docker exec -it aprobaciones-db psql -U admin -d aprobaciones_db

# Ejecutar script de inicialización (ver database/init.sql)
# O ejecutar comandos manuales:
CREATE TABLE solicitudes (...);
CREATE TABLE historico_solicitudes (...);

Ejecutar Backend
consola
cd backend
npm install
node app.js
# Servidor en: http://localhost:3000
4. Ejecutar Frontend
consola
cd frontend

#Endpoints API

#Solicitudes 

GET /api/solicitudes - Listar todas

GET /api/solicitudes/:id - Obtener específica

POST /api/solicitudes - Crear nueva

PUT /api/solicitudes/:id - Actualizar estado

Catálogos
GET /api/tipos-solicitud - Tipos disponibles

Ejemplo JSON - Crear Solicitud

json
{
  "titulo": "Publicar microservicio de pagos",
  "descripcion": "Versión 2.0.0 con mejoras de seguridad",
  "solicitante": "juan.perez",
  "responsable": "maria.gomez",
  "tipo_solicitud": "despliegue"
} 

#El sistema incluye datos iniciales para demostración:

4 solicitudes pre-creadas

Tipos: despliegue, acceso, cambio técnico, otros

Usuarios de prueba: juan.perez, maria.gomez, etc.

#contribucion 

Este proyecto fue desarrollado como parte del proceso de selección del Banco Bogotá. No acepta contribuciones externas.

Licencia
© 2026 - Desarrollado para el reto técnico del Banco Bogotá. Todos los derechos reservados.

Autor
Tomas Santiago Segura Toro- [santiago2331 en GitHub]

"Sistema desarrollado con Node.js, PostgreSQL y JavaScript vanilla para el reto Fullstack/Cloud del Banco Bogotá"
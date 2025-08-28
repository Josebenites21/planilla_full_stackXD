# 🚀 Sistema de Planillas Completo

Sistema completo de gestión de planillas con frontend Angular, backend Node.js y base de datos MongoDB.

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   MongoDB       │
│   Angular       │◄──►│   Node.js       │◄──►│   Base de       │
│   (Puerto 4200) │    │   (Puerto 3000) │    │   Datos         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tecnologías

### Frontend (Angular)
- **Angular 20** - Framework de frontend
- **TypeScript** - Lenguaje de programación
- **CSS3** - Estilos y diseño responsive

### Backend (Node.js)
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **CORS** - Cross-origin resource sharing

### DevOps
- **Docker** - Contenedorización
- **GitHub Actions** - CI/CD automático
- **Portainer** - Gestión de contenedores

## 📁 Estructura del Proyecto

```
├── Frontend/
│   └── admin_planilla/          # Aplicación Angular
│       ├── src/
│       │   ├── app/
│       │   │   ├── dashboard/   # Dashboard principal
│       │   │   ├── trabajadores/# Gestión de empleados
│       │   │   ├── login/       # Autenticación
│       │   │   └── services/    # Servicios HTTP
│       │   └── main.ts
│       └── Dockerfile
├── Backend/
│   └── api/                     # API Node.js
│       ├── routes/              # Rutas de la API
│       ├── models/              # Modelos de MongoDB
│       ├── controllers/         # Controladores
│       └── server.js            # Servidor principal
├── docker-compose.yml           # Orquestación de servicios
└── README.md                    # Este archivo
```

## 🚀 Endpoints de la API

### Ruta Raíz
- `GET /` - Estado de la API
- `GET /?mes=YYYY-MM` - Consultar pagos por mes

### Empleados
- `GET /empleados` - Listar empleados
- `POST /empleados` - Crear empleado
- `PUT /empleados/:id` - Actualizar empleado
- `DELETE /empleados/:id` - Eliminar empleado

### Planillas
- `GET /planillas` - Listar planillas
- `POST /planillas` - Crear planilla

### Historial
- `GET /historial` - Listar historial completo
- `GET /historial/mes/:mes` - Historial por mes
- `GET /historial/empleado/:id` - Historial por empleado

## 🐳 Docker

### Construir y ejecutar localmente:
```bash
# Construir todas las imágenes
docker-compose build

# Ejecutar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### Acceder a la aplicación:
- **Frontend**: http://localhost:4200
- **Backend**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017

## 🔧 Variables de Entorno

```env
# Backend
MONGO_URI=mongodb://usuario:password@host:puerto/database
PORT=3000
NODE_ENV=production

# Frontend
API_URL=http://localhost:3000
```

## 🚀 Desarrollo

### Frontend (Angular):
```bash
cd Frontend/admin_planilla
npm install
ng serve
```

### Backend (Node.js):
```bash
cd Backend/api
npm install
npm run dev
```

## 📊 Base de Datos

### Colecciones principales:
- **empleados** - Información de empleados
- **historial_pagos** - Historial de pagos y ajustes
- **planillas** - Planillas mensuales

### Ejemplo de consulta:
```javascript
// Consultar pagos por mes
db.historial_pagos.find({mes: "2025-08"})

// Consultar empleados activos
db.empleados.find({estado: "activo"})
```

## 🔄 CI/CD con GitHub Actions

El proyecto está configurado para:
- **Construir automáticamente** imágenes Docker en cada push
- **Subir a Docker Hub** con tags automáticos
- **Desplegar en Portainer** con solo actualizar la imagen

## 📝 Notas Importantes

- **La base de datos MongoDB se mantiene intacta** en el servidor
- **Los cambios de código se reflejan automáticamente** en Docker
- **No se pierden datos** al actualizar el código
- **Rollback fácil** cambiando la imagen en Portainer

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

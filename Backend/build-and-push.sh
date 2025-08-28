#!/bin/bash

echo "🚀 Construyendo nueva imagen del backend..."
docker build -t josebenites21/planilla-backend:fix-consulta-mes .

echo "📤 Subiendo imagen a Docker Hub..."
docker push josebenites21/planilla-backend:fix-consulta-mes

echo "✅ Imagen subida exitosamente!"
echo "🔧 Ahora actualiza tu stack en Portainer con la nueva imagen:"
echo "   josebenites21/planilla-backend:fix-consulta-mes"

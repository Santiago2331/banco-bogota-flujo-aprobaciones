**`flujo-aprobaciones/database/init.sql`**

```sql
-- ============================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS
-- Sistema de Flujo de Aprobaciones - Banco Bogotá
-- ============================================

-- Crear tabla principal de solicitudes
CREATE TABLE IF NOT EXISTS solicitudes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    solicitante VARCHAR(100) NOT NULL,
    responsable VARCHAR(100) NOT NULL,
    tipo_solicitud VARCHAR(50) NOT NULL CHECK (tipo_solicitud IN ('despliegue', 'acceso', 'cambio_tecnico', 'otros')),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
    comentario TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_accion VARCHAR(100)
);

-- Crear tabla para histórico de cambios
CREATE TABLE IF NOT EXISTS historico_solicitudes (
    id SERIAL PRIMARY KEY,
    solicitud_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    usuario_accion VARCHAR(100) NOT NULL,
    comentario TEXT,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- ============================================
-- DATOS DE PRUEBA PARA DEMOSTRACIÓN
-- ============================================

-- Insertar solicitudes de prueba
INSERT INTO solicitudes (titulo, descripcion, solicitante, responsable, tipo_solicitud, estado) VALUES
('Publicar microservicio de pagos v2.0', 'Nueva versión con mejoras en seguridad y optimización de transacciones', 'juan.perez', 'maria.gomez', 'despliegue', 'pendiente'),
('Acceso a herramienta de monitoreo CloudWatch', 'Necesito acceso para monitorear métricas del equipo DevOps en AWS', 'carlos.lopez', 'ana.rodriguez', 'acceso', 'pendiente'),
('Cambio técnico en pipeline CI/CD', 'Actualizar versión de Node.js de 14 a 18 en pipeline de despliegue automático', 'laura.martinez', 'pedro.sanchez', 'cambio_tecnico', 'pendiente'),
('Incorporar nueva librería de logging', 'Propuesta para incluir Winston como sistema centralizado de logs en todos los microservicios', 'andres.castro', 'sandra.ruiz', 'otros', 'pendiente'),
('Aprobación para acceso a base de datos producción', 'Desarrollador necesita acceso de lectura a BD de producción para debugging', 'fernando.garcia', 'isabel.mendoza', 'acceso', 'aprobado'),
('Revisión de cambio en configuración de load balancer', 'Modificación en reglas de balanceo de carga para nuevo microservicio', 'ricardo.fernandez', 'patricia.lopez', 'despliegue', 'rechazado')
ON CONFLICT DO NOTHING;

-- Insertar histórico de cambios para demostración
INSERT INTO historico_solicitudes (solicitud_id, estado_anterior, estado_nuevo, usuario_accion, comentario) 
SELECT 
    s.id,
    'pendiente' as estado_anterior,
    s.estado as estado_nuevo,
    s.responsable as usuario_accion,
    CASE 
        WHEN s.estado = 'aprobado' THEN 'Solicitud aprobada después de revisar todos los tests'
        WHEN s.estado = 'rechazado' THEN 'Falta documentación de seguridad requerida'
        ELSE NULL 
    END as comentario
FROM solicitudes s
WHERE s.estado IN ('aprobado', 'rechazado')
ON CONFLICT DO NOTHING;


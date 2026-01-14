
const pool = require('../database.js'); 

class SolicitudesService {
    async crearSolicitud(solicitud) {
        const { titulo, descripcion, solicitante, responsable, tipo_solicitud } = solicitud;
        const query = `
            INSERT INTO solicitudes (titulo, descripcion, solicitante, responsable, tipo_solicitud)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;
        const values = [titulo, descripcion, solicitante, responsable, tipo_solicitud];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async obtenerSolicitudes() {
        const query = 'SELECT * FROM solicitudes ORDER BY fecha_creacion DESC';
        const result = await pool.query(query);
        return result.rows;
    }

    async obtenerSolicitudPorId(id) {
        const query = 'SELECT * FROM solicitudes WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async actualizarSolicitud(id, estado, usuario_accion, comentario) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Obtener estado actual
            const solicitudActual = await client.query(
                'SELECT estado FROM solicitudes WHERE id = $1',
                [id]
            );
            
            // Actualizar solicitud
            const updateQuery = `
                UPDATE solicitudes 
                SET estado = $1, usuario_accion = $2, comentario = $3, fecha_actualizacion = CURRENT_TIMESTAMP
                WHERE id = $4
                RETURNING *`;
            const updateResult = await client.query(updateQuery, [estado, usuario_accion, comentario, id]);
            
            // Registrar en histórico
            const historicoQuery = `
                INSERT INTO historico_solicitudes 
                (solicitud_id, estado_anterior, estado_nuevo, usuario_accion, comentario)
                VALUES ($1, $2, $3, $4, $5)`;
            await client.query(historicoQuery, [
                id, 
                solicitudActual.rows[0]?.estado || 'pendiente', 
                estado, 
                usuario_accion, 
                comentario
            ]);
            
            await client.query('COMMIT');
            return updateResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async obtenerTiposSolicitud() {
        return ['despliegue', 'acceso', 'cambio_tecnico', 'otros'];
    }
}

module.exports = new SolicitudesService();
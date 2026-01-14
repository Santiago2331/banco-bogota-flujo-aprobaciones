const solicitudesService = require('../services/solicitudes.service.js');

class SolicitudesController {
    async crearSolicitud(req, res) {
        try {
            const solicitud = await solicitudesService.crearSolicitud(req.body);
            res.status(201).json({
                success: true,
                data: solicitud,
                message: 'Solicitud creada exitosamente'
            });
        } catch (error) {
            console.error('Error en crearSolicitud:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear solicitud',
                error: error.message
            });
        }
    }

    async obtenerSolicitudes(req, res) {
        try {
            const solicitudes = await solicitudesService.obtenerSolicitudes();
            res.status(200).json({
                success: true,
                data: solicitudes
            });
        } catch (error) {
            console.error('Error en obtenerSolicitudes:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener solicitudes',
                error: error.message
            });
        }
    }

    async obtenerSolicitud(req, res) {
        try {
            const solicitud = await solicitudesService.obtenerSolicitudPorId(req.params.id);
            if (!solicitud) {
                return res.status(404).json({
                    success: false,
                    message: 'Solicitud no encontrada'
                });
            }
            res.status(200).json({
                success: true,
                data: solicitud
            });
        } catch (error) {
            console.error('Error en obtenerSolicitud:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener solicitud',
                error: error.message
            });
        }
    }

    async actualizarSolicitud(req, res) {
        try {
            const { estado, usuario_accion, comentario } = req.body;
            const solicitud = await solicitudesService.actualizarSolicitud(
                req.params.id,
                estado,
                usuario_accion,
                comentario
            );
            res.status(200).json({
                success: true,
                data: solicitud,
                message: 'Solicitud actualizada exitosamente'
            });
        } catch (error) {
            console.error('Error en actualizarSolicitud:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar solicitud',
                error: error.message
            });
        }
    }

    async obtenerTiposSolicitud(req, res) {
        try {
            const tipos = await solicitudesService.obtenerTiposSolicitud();
            res.status(200).json({
                success: true,
                data: tipos
            });
        } catch (error) {
            console.error('Error en obtenerTiposSolicitud:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener tipos de solicitud',
                error: error.message
            });
        }
    }
}

module.exports = new SolicitudesController();
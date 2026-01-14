const express = require('express');
const router = express.Router();
const solicitudesController = require('../controllers/solicitudes.controller.js');


router.post('/solicitudes', solicitudesController.crearSolicitud);
router.get('/solicitudes', solicitudesController.obtenerSolicitudes);
router.get('/solicitudes/:id', solicitudesController.obtenerSolicitud);
router.put('/solicitudes/:id', solicitudesController.actualizarSolicitud);
router.get('/tipos-solicitud', solicitudesController.obtenerTiposSolicitud);

module.exports = router;
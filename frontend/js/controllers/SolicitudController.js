class SolicitudController {
    constructor(model, view, apiService) {
        this.model = model;
        this.view = view;
        this.api = apiService;
        
        this.currentSolicitudId = null;
        
        this.init();
    }

    async init() {
        
        const connected = await this.api.checkConnection();
        this.view.updateApiStatus(connected);
        
        if (!connected) {
            this.view.showError('No se pudo conectar al backend. Verifica que esté corriendo en http://localhost:3000');
            return;
        }

        
        await this.loadTiposSolicitud();
        await this.loadSolicitudes();
        
       
        this.bindEvents();
        
        
        this.model.subscribe((solicitudes) => {
            this.updateView(solicitudes);
        });
    }

    // Cargar tipos de solicitud desde API
    async loadTiposSolicitud() {
        try {
            const response = await this.api.getTiposSolicitud();
            const tipos = response.data;
            this.model.setTiposSolicitud(tipos);
            this.view.renderTiposSolicitud(tipos);
        } catch (error) {
            this.view.showError('Error cargando tipos de solicitud');
            console.error(error);
        }
    }

    // Cargar todas las solicitudes
    async loadSolicitudes() {
        try {
            const response = await this.api.obtenerSolicitudes();
            const solicitudes = response.data;
            this.model.setSolicitudes(solicitudes);
            
            // Actualizar badge de pendientes
            const pendientesCount = this.model.countPendientes();
            this.view.updatePendientesBadge(pendientesCount);
            
        } catch (error) {
            this.view.showError('Error cargando solicitudes');
            console.error(error);
        }
    }

    // Vincular todos los eventos
    bindEvents() {
        // Formulario crear solicitud
        this.view.bindFormSubmit(() => this.handleCreateSolicitud());
        
        // Botón limpiar formulario
        this.view.bindClearForm(() => this.view.clearForm());
        
        // Búsqueda en pendientes
        this.view.onSearch = (query) => this.handleSearch(query);
        
        // Filtro en historial
        this.view.onFilterChange = (estado) => this.handleFilterChange(estado);
        
        // Botones de acción en solicitudes
        this.view.bindSolicitudActions(
            (id) => this.handleViewSolicitud(id),
            (id) => this.handleReviewSolicitud(id)
        );
        
        // Botones aprobar/rechazar en modal
        this.view.bindApproveReject(
            () => this.handleApproveSolicitud(),
            () => this.handleRejectSolicitud()
        );
    }

    // Manejar creación de solicitud
    async handleCreateSolicitud() {
        try {
            const formData = this.view.getFormData();
            
            // Validar campos requeridos
            if (!this.validateFormData(formData)) {
                this.view.showError('Por favor completa todos los campos requeridos');
                return;
            }
            
            // Crear solicitud en API
            const response = await this.api.crearSolicitud(formData);
            
            // Actualizar modelo y vista
            this.model.addSolicitud(response.data);
            this.view.clearForm();
            this.view.showSuccess('¡Solicitud creada exitosamente!');
            
            // Cambiar a pestaña de pendientes
            this.view.switchTab('pendientes');
            
            // Actualizar badge
            const pendientesCount = this.model.countPendientes();
            this.view.updatePendientesBadge(pendientesCount);
            
        } catch (error) {
            this.view.showError(error.message || 'Error creando solicitud');
            console.error(error);
        }
    }

    // Validar datos del formulario
    validateFormData(data) {
        return data.titulo && 
               data.descripcion && 
               data.solicitante && 
               data.responsable && 
               data.tipo_solicitud;
    }

    // Manejar búsqueda
    handleSearch(query) {
        const resultados = this.model.searchSolicitudes(query);
        const pendientes = resultados.filter(s => s.estado === 'pendiente');
        this.view.renderPendientes(pendientes);
    }

    // Manejar cambio de filtro
    handleFilterChange(estado) {
        const solicitudesFiltradas = this.model.getSolicitudesByEstado(estado);
        this.view.renderHistorial(solicitudesFiltradas);
    }

    // Manejar ver solicitud (solo mostrar)
    async handleViewSolicitud(id) {
        try {
            const response = await this.api.obtenerSolicitud(id);
            const solicitud = response.data;
            
            // Mostrar en modal (solo visualización)
            this.view.renderDetallesModal(solicitud);
            this.view.showModal();
            
            // Ocultar botones de acción en modal
            document.getElementById('btn-aprobar').style.display = 'none';
            document.getElementById('btn-rechazar').style.display = 'none';
            
        } catch (error) {
            this.view.showError('Error cargando solicitud');
            console.error(error);
        }
    }

    // Manejar revisión de solicitud (con acciones)
    async handleReviewSolicitud(id) {
        try {
            this.currentSolicitudId = id;
            
            const response = await this.api.obtenerSolicitud(id);
            const solicitud = response.data;
            
            // Guardar en modelo
            this.model.setCurrentSolicitud(solicitud);
            
            // Mostrar en modal con botones de acción
            this.view.renderDetallesModal(solicitud);
            this.view.showModal();
            
            // Mostrar botones de acción
            document.getElementById('btn-aprobar').style.display = 'inline-flex';
            document.getElementById('btn-rechazar').style.display = 'inline-flex';
            
        } catch (error) {
            this.view.showError('Error cargando solicitud para revisión');
            console.error(error);
        }
    }

    // Manejar aprobación de solicitud
    async handleApproveSolicitud() {
        await this.updateSolicitudEstado('aprobado');
    }

    // Manejar rechazo de solicitud
    async handleRejectSolicitud() {
        await this.updateSolicitudEstado('rechazado');
    }

    // Actualizar estado de solicitud (común para aprobar/rechazar)
    async updateSolicitudEstado(estado) {
        try {
            const modalData = this.view.getModalData();
            
            // Validar usuario aprobador
            if (!modalData.usuario_accion) {
                this.view.showError('Por favor selecciona el usuario que realiza la acción');
                return;
            }
            
            const estadoData = {
                estado: estado,
                usuario_accion: modalData.usuario_accion,
                comentario: modalData.comentario || ''
            };
            
            // Actualizar en API
            const response = await this.api.actualizarSolicitud(this.currentSolicitudId, estadoData);
            
            // Actualizar modelo
            this.model.updateSolicitud(response.data);
            
            // Cerrar modal y mostrar éxito
            this.view.hideModal();
            
            const mensaje = estado === 'aprobado' 
                ? '¡Solicitud aprobada exitosamente!' 
                : 'Solicitud rechazada';
                
            this.view.showSuccess(mensaje);
            
            // Actualizar badge de pendientes
            const pendientesCount = this.model.countPendientes();
            this.view.updatePendientesBadge(pendientesCount);
            
            // Recargar vista actual
            const currentTab = document.querySelector('.tab-btn.active').dataset.tab;
            if (currentTab === 'pendientes') {
                const pendientes = this.model.getPendientes();
                this.view.renderPendientes(pendientes);
            }
            
        } catch (error) {
            this.view.showError(error.message || `Error ${estado === 'aprobado' ? 'aprobando' : 'rechazando'} solicitud`);
            console.error(error);
        }
    }

    // Actualizar vista cuando cambia el modelo
    updateView(solicitudes) {
        // Actualizar pendientes si estamos en esa pestaña
        if (document.querySelector('[data-tab="pendientes"]').classList.contains('active')) {
            const pendientes = solicitudes.filter(s => s.estado === 'pendiente');
            this.view.renderPendientes(pendientes);
        }
        
        // Actualizar historial si estamos en esa pestaña
        if (document.querySelector('[data-tab="historial"]').classList.contains('active')) {
            const estadoFiltro = document.getElementById('filtro-estado').value;
            const historialFiltrado = estadoFiltro === 'todos' 
                ? solicitudes 
                : solicitudes.filter(s => s.estado === estadoFiltro);
            this.view.renderHistorial(historialFiltrado);
        }
    }
}



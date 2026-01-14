class SolicitudView {
    constructor() {
        this.crearTab = document.getElementById('crear-tab');
        this.pendientesTab = document.getElementById('pendientes-tab');
        this.historialTab = document.getElementById('historial-tab');
        
        this.formSolicitud = document.getElementById('form-solicitud');
        this.listaPendientes = document.getElementById('lista-pendientes');
        this.listaHistorial = document.getElementById('lista-historial');
        
        this.modal = document.getElementById('modal-aprobar');
        this.modalDetalles = document.getElementById('modal-detalles');
        
        this.buscarPendientes = document.getElementById('buscar-pendientes');
        this.filtroEstado = document.getElementById('filtro-estado');
        
        this.apiStatus = document.getElementById('api-status');
        this.badgePendientes = document.getElementById('badge-pendientes');
        
        this.bindTabs();
        this.bindModal();
        this.bindSearch();
    }

    // Vincular eventos de tabs
    bindTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }

    // Cambiar tab
    switchTab(tabId) {
        // Remover active de todos
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Activar tab seleccionado
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }

    // Vincular modal
    bindModal() {
        const closeBtn = this.modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => this.hideModal());
        
        // Cerrar modal al hacer clic fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
    }

    // Mostrar modal
    showModal() {
        this.modal.classList.add('active');
    }

    // Ocultar modal
    hideModal() {
        this.modal.classList.remove('active');
        this.modalDetalles.innerHTML = '';
        document.getElementById('comentario-aprobador').value = '';
        document.getElementById('usuario-aprobador').selectedIndex = 0;
    }

    // Vincular búsqueda
    bindSearch() {
        this.buscarPendientes.addEventListener('input', () => {
            const query = this.buscarPendientes.value;
            if (typeof this.onSearch === 'function') {
                this.onSearch(query);
            }
        });

        this.filtroEstado.addEventListener('change', () => {
            const estado = this.filtroEstado.value;
            if (typeof this.onFilterChange === 'function') {
                this.onFilterChange(estado);
            }
        });
    }

    // Renderizar tipos de solicitud en select
    renderTiposSolicitud(tipos) {
        const select = document.getElementById('tipo');
        select.innerHTML = '<option value="">Seleccionar...</option>';
        
        tipos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo;
            option.textContent = this.formatTipo(tipo);
            select.appendChild(option);
        });
    }

    // Formatear tipo para mostrar
    formatTipo(tipo) {
        const tiposMap = {
            'despliegue': 'Despliegue',
            'acceso': 'Acceso',
            'cambio_tecnico': 'Cambio Técnico',
            'otros': 'Otros'
        };
        return tiposMap[tipo] || tipo;
    }

    // Renderizar solicitudes pendientes
    renderPendientes(solicitudes) {
        this.listaPendientes.innerHTML = '';
        
        if (solicitudes.length === 0) {
            this.listaPendientes.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No hay solicitudes pendientes</p>
                </div>
            `;
            return;
        }

        solicitudes.forEach(solicitud => {
            const solicitudElement = this.createSolicitudElement(solicitud, true);
            this.listaPendientes.appendChild(solicitudElement);
        });
    }

    // Renderizar historial
    renderHistorial(solicitudes) {
        this.listaHistorial.innerHTML = '';
        
        if (solicitudes.length === 0) {
            this.listaHistorial.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>No hay solicitudes en el historial</p>
                </div>
            `;
            return;
        }

        solicitudes.forEach(solicitud => {
            const solicitudElement = this.createSolicitudElement(solicitud, false);
            this.listaHistorial.appendChild(solicitudElement);
        });
    }

    // Crear elemento HTML para solicitud
    createSolicitudElement(solicitud, showActions = false) {
        const div = document.createElement('div');
        div.className = `solicitud-item ${solicitud.estado}`;
        div.dataset.id = solicitud.id;

        const estadoText = {
            'pendiente': 'Pendiente',
            'aprobado': 'Aprobado',
            'rechazado': 'Rechazado'
        }[solicitud.estado] || solicitud.estado;

        const fecha = new Date(solicitud.fecha_creacion).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let actionsHTML = '';
        if (showActions) {
            actionsHTML = `
                <div class="solicitud-actions">
                    <button class="btn btn-small btn-ver" data-id="${solicitud.id}">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn btn-small btn-aprobar-modal" data-id="${solicitud.id}">
                        <i class="fas fa-clipboard-check"></i> Revisar
                    </button>
                </div>
            `;
        }

        div.innerHTML = `
            <div class="solicitud-header">
                <div class="solicitud-title">${solicitud.titulo}</div>
                <span class="solicitud-badge badge-${solicitud.estado}">${estadoText}</span>
            </div>
            <div class="solicitud-body">
                <p class="solicitud-desc">${solicitud.descripcion}</p>
                <div class="solicitud-meta">
                    <span><i class="fas fa-user"></i> ${solicitud.solicitante}</span>
                    <span><i class="fas fa-user-check"></i> ${solicitud.responsable}</span>
                    <span><i class="fas fa-tag"></i> ${this.formatTipo(solicitud.tipo_solicitud)}</span>
                    <span><i class="fas fa-calendar"></i> ${fecha}</span>
                </div>
            </div>
            ${actionsHTML}
        `;

        return div;
    }

    // Mostrar detalles en modal
    renderDetallesModal(solicitud) {
        const fecha = new Date(solicitud.fecha_creacion).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        this.modalDetalles.innerHTML = `
            <div class="solicitud-detalle">
                <h4>${solicitud.titulo}</h4>
                <p><strong>Descripción:</strong> ${solicitud.descripcion}</p>
                <div class="detalle-grid">
                    <div><strong>Solicitante:</strong> ${solicitud.solicitante}</div>
                    <div><strong>Responsable:</strong> ${solicitud.responsable}</div>
                    <div><strong>Tipo:</strong> ${this.formatTipo(solicitud.tipo_solicitud)}</div>
                    <div><strong>Estado:</strong> <span class="badge-${solicitud.estado}">${solicitud.estado}</span></div>
                    <div><strong>Fecha creación:</strong> ${fecha}</div>
                    ${solicitud.comentario ? `<div><strong>Comentario anterior:</strong> ${solicitud.comentario}</div>` : ''}
                </div>
            </div>
        `;
    }

    // Actualizar badge de pendientes
    updatePendientesBadge(count) {
        this.badgePendientes.textContent = count;
    }

    // Actualizar estado de API
    updateApiStatus(connected) {
        if (connected) {
            this.apiStatus.textContent = 'Conectado';
            this.apiStatus.className = 'status-online';
        } else {
            this.apiStatus.textContent = 'Desconectado';
            this.apiStatus.className = 'status-offline';
        }
    }

    // Limpiar formulario
    clearForm() {
        this.formSolicitud.reset();
    }

    // Mostrar mensaje de éxito
    showSuccess(message) {
        alert(message); // Puedes reemplazar con un toast más elegante
    }

    // Mostrar mensaje de error
    showError(message) {
        alert(`Error: ${message}`);
    }

    // Vincular eventos del formulario
    bindFormSubmit(handler) {
        this.formSolicitud.addEventListener('submit', (e) => {
            e.preventDefault();
            handler();
        });
    }

    // Vincular botón limpiar
    bindClearForm(handler) {
        document.getElementById('btn-limpiar').addEventListener('click', handler);
    }

    // Vincular botones de aprobar/rechazar
    bindApproveReject(approveHandler, rejectHandler) {
        document.getElementById('btn-aprobar').addEventListener('click', approveHandler);
        document.getElementById('btn-rechazar').addEventListener('click', rejectHandler);
    }

    // Vincular botones de ver/editar
    bindSolicitudActions(viewHandler, reviewHandler) {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-ver')) {
                const id = e.target.closest('.btn-ver').dataset.id;
                viewHandler(id);
            }
            
            if (e.target.closest('.btn-aprobar-modal')) {
                const id = e.target.closest('.btn-aprobar-modal').dataset.id;
                reviewHandler(id);
            }
        });
    }

    // Obtener datos del formulario
    getFormData() {
        return {
            titulo: document.getElementById('titulo').value,
            descripcion: document.getElementById('descripcion').value,
            solicitante: document.getElementById('solicitante').value,
            responsable: document.getElementById('responsable').value,
            tipo_solicitud: document.getElementById('tipo').value
        };
    }

    // Obtener datos del modal
    getModalData() {
        return {
            usuario_accion: document.getElementById('usuario-aprobador').value,
            comentario: document.getElementById('comentario-aprobador').value
        };
    }
}



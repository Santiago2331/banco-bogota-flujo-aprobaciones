class SolicitudModel {
    constructor() {
        this.solicitudes = [];
        this.tiposSolicitud = [];
        this.currentSolicitud = null;
        this.listeners = [];
    }

    
    subscribe(listener) {
        this.listeners.push(listener);
    }

    
    notify() {
        this.listeners.forEach(listener => listener(this.solicitudes));
    }

    
    setSolicitudes(solicitudes) {
        this.solicitudes = solicitudes;
        this.notify();
    }

    
    addSolicitud(solicitud) {
        this.solicitudes.unshift(solicitud);
        this.notify();
    }

    
    updateSolicitud(updatedSolicitud) {
        const index = this.solicitudes.findIndex(s => s.id === updatedSolicitud.id);
        if (index !== -1) {
            this.solicitudes[index] = updatedSolicitud;
            this.notify();
        }
    }

    // Obtener solicitudes por estado
    getSolicitudesByEstado(estado) {
        if (estado === 'todos') {
            return this.solicitudes;
        }
        return this.solicitudes.filter(s => s.estado === estado);
    }

    // Obtener solicitudes pendientes
    getPendientes() {
        return this.solicitudes.filter(s => s.estado === 'pendiente');
    }

    
    countPendientes() {
        return this.getPendientes().length;
    }

    // Set tipos de solicitud
    setTiposSolicitud(tipos) {
        this.tiposSolicitud = tipos;
    }

    // Get tipos de solicitud
    getTiposSolicitud() {
        return this.tiposSolicitud;
    }

    // Set solicitud actual para edición
    setCurrentSolicitud(solicitud) {
        this.currentSolicitud = solicitud;
    }

    // Get solicitud actual
    getCurrentSolicitud() {
        return this.currentSolicitud;
    }

    // Buscar solicitudes
    searchSolicitudes(query) {
        if (!query) return this.solicitudes;
        
        const lowerQuery = query.toLowerCase();
        return this.solicitudes.filter(s => 
            s.titulo.toLowerCase().includes(lowerQuery) ||
            s.solicitante.toLowerCase().includes(lowerQuery) ||
            s.descripcion.toLowerCase().includes(lowerQuery)
        );
    }
}


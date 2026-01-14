const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
    constructor() {
        console.log('API Service inicializado');
    }

        async checkConnection() {
        try {
            
            const response = await fetch('http://localhost:3000/', {
                mode: 'cors',  
                headers: {
                    'Accept': 'application/json'
                }
            });
            console.log('Respuesta de conexión:', response.status, response.statusText);
            return response.ok;
        } catch (error) {
            console.error('Error conectando al backend:', error);
            return false;
        }
    }
    // Obtener tipos de solicitud
    async getTiposSolicitud() {
        try {
            const response = await fetch(`${API_BASE_URL}/tipos-solicitud`);
            if (!response.ok) throw new Error('Error obteniendo tipos');
            return await response.json();
        } catch (error) {
            console.error('Error en getTiposSolicitud:', error);
            throw error;
        }
    }

    // Crear nueva solicitud
    async crearSolicitud(solicitudData) {
        try {
            const response = await fetch(`${API_BASE_URL}/solicitudes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(solicitudData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error creando solicitud');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error en crearSolicitud:', error);
            throw error;
        }
    }

    // Obtener todas las solicitudes
    async obtenerSolicitudes() {
        try {
            const response = await fetch(`${API_BASE_URL}/solicitudes`);
            if (!response.ok) throw new Error('Error obteniendo solicitudes');
            return await response.json();
        } catch (error) {
            console.error('Error en obtenerSolicitudes:', error);
            throw error;
        }
    }

    // Obtener una solicitud específica
    async obtenerSolicitud(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/solicitudes/${id}`);
            if (!response.ok) throw new Error('Error obteniendo solicitud');
            return await response.json();
        } catch (error) {
            console.error('Error en obtenerSolicitud:', error);
            throw error;
        }
    }

    // Actualizar estado de solicitud
    async actualizarSolicitud(id, estadoData) {
        try {
            const response = await fetch(`${API_BASE_URL}/solicitudes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(estadoData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error actualizando solicitud');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error en actualizarSolicitud:', error);
            throw error;
        }
    }
}


// NO imports, las clases ya son globales

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Aplicación de Flujo de Aprobaciones iniciando...');
    
    try {
        // Inicializar componentes MVC
        const apiService = new ApiService();
        const model = new SolicitudModel();
        const view = new SolicitudView();
        const controller = new SolicitudController(model, view, apiService);
        
        // Hacer disponibles en consola para debugging
        window.app = {
            apiService,
            model,
            view,
            controller
        };
        
        console.log('Aplicación MVC inicializada correctamente');
        
    } catch (error) {
        console.error('Error inicializando la aplicación:', error);
        alert('Error inicializando la aplicación: ' + error.message);
    }
});
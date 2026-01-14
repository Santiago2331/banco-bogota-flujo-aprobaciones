const express = require('express');
const cors = require('cors');
const solicitudesRoutes = require('./routes/solicitudes.routes.js');

const app = express();


app.use(cors({
    origin: '*',  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


app.use('/api', solicitudesRoutes);


app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Flujo de Aprobaciones funcionando',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    console.log(`Prueba la API en: http://localhost:${PORT}/api/solicitudes`);
});
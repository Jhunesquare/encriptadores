const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { Server } = require('socket.io');

const app = express();

// Certificados SSL
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

// Crear servidor HTTPS
const httpsServer = https.createServer(options, app);

// Inicializar socket.io con el servidor HTTPS
const io = new Server(httpsServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Puerto
const PORT = 3000;

// Socket.IO
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  socket.on('mensaje_encriptado', (mensaje) => {
    console.log('Mensaje recibido:', mensaje);
    io.emit('mensaje_recibido', mensaje);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Servir archivos estáticos
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));
app.use(express.static(path.join(__dirname, 'public')));

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Iniciar el servidor
httpsServer.listen(PORT, () => {
  console.log(`Servidor HTTPS en puerto ${PORT}`);
});

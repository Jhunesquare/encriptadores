const express= require('express')
const http = require('http')
const socketIo = require('socket.io');

const { Server } = require('socket.io');
const path = require('path');

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const PORT = 3000

// Configuración de Socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Escucha mensajes encriptados y los retransmite
  socket.on('mensaje_encriptado', (mensaje) => {
    console.log('Mensaje recibido:', mensaje);
    io.emit('mensaje_recibido', mensaje); // Envía a todos los clientes
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Configuración para servir socket.io.js
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
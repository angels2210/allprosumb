const express = require("express");
const router = express.Router();

// 0. Listar sesiones (GET /api/chat/sessions)
router.get("/sessions", (req, res) => {
  // TODO: Consultar sesiones activas
  res.json([{ id: "ip8hyl", user: "Cliente Invitado", lastMessage: "Hola" }]);
});

// 1. Obtener mensajes (GET /api/chat/messages/:chatId)
router.get("/messages/:chatId", (req, res) => {
  const { chatId } = req.params;
  console.log(`[GET] Obteniendo mensajes para el chat: ${chatId}`);

  // TODO: Aquí deberías consultar tu base de datos
  // Ejemplo de respuesta simulada:
  res.json([
    { 
      id: 1, 
      text: "Bienvenido al soporte. ¿En qué podemos ayudarte?", 
      sender: "system", 
      timestamp: new Date() 
    }
  ]);
});

// 2. Guardar mensaje (POST /api/chat/messages)
router.post("/messages", (req, res) => {
  const { chatId, text, sender } = req.body;
  console.log(`[POST] Guardando mensaje en chat ${chatId}: ${text}`);

  // TODO: Guardar en base de datos
  res.status(201).json({ success: true, message: "Mensaje guardado" });
});

// 3. Enviar mensaje (POST /api/chat/send)
router.post("/send", (req, res) => {
  console.log(`[POST] Enviando mensaje:`, req.body);

  // TODO: Lógica de envío (ej. Socket.io o notificación)
  res.status(200).json({ success: true, message: "Mensaje enviado" });
});

module.exports = router;

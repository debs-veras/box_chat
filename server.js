import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = createServer(app);
const ip = process.env.SERVER_URL;

// Criando servidor Socket.IO com CORS configurado
const io = new Server(server, {
  cors: {
    origin: ip,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Estruturas para gerenciar usuários e conversas
const usuariosConectados = new Set(); // Guarda os IDs dos usuários conectados
const socketToUsuario = new Map(); // Map socketId -> usuarioId
const usuarioToSockets = new Map(); // Map usuarioId -> Set de socketIds (para múltiplas conexões)
const conversasPorUsuario = new Map(); // Map usuarioId -> lista de conversas (contatos)
const mensagensPorConversa = new Map(); // Map "usuarioA-usuarioB" (chave) -> lista de mensagens

// Função para atualizar ou adicionar uma conversa na lista de conversas de um usuário
function atualizaOuAdicionaConversa(lista, contatoId, mensagem) {
  const agora = new Date().toISOString();

  // Verifica se já existe conversa com o contatoId
  const existente = lista.find((c) => c.usuarioId === contatoId);

  if (existente) {
    // Atualiza última mensagem e timestamp
    existente.ultimaMensagem = mensagem;
    existente.dataUltimaMensagem = agora;
  } else {
    // Adiciona nova conversa
    lista.push({
      usuarioId: contatoId,
      ultimaMensagem: mensagem,
      dataUltimaMensagem: agora,
    });
  }
}

// Quando um cliente conecta via socket
io.on("connection", (socket) => {
  console.log(`Socket conectado: ${socket.id}`);
  // Evento: registrar usuário no servidor
  socket.on("registrar-usuario", (usuarioId) => {
    console.log(`Usuário registrado: ${usuarioId} (socket ${socket.id})`);

    // Mapear socket para usuário
    socketToUsuario.set(socket.id, usuarioId);
    // Adicionar usuário ao conjunto de conectados
    usuariosConectados.add(usuarioId);

    // Adicionar o socket na lista de sockets do usuário
    if (!usuarioToSockets.has(usuarioId)) {
      usuarioToSockets.set(usuarioId, new Set());
    }
    usuarioToSockets.get(usuarioId).add(socket.id);

    // Para cada socket conectado, enviar a lista de usuários online (excluindo ele próprio)
    for (const [sockId, id] of socketToUsuario.entries()) {
      const outrosUsuarios = Array.from(usuariosConectados).filter(
        (uid) => uid !== id
      );
      io.to(sockId).emit("usuarios-online", outrosUsuarios);
    }
  });

  // Evento: receber mensagem de chat
  socket.on("chat message", (msg) => {
    const { de, para, conteudo } = msg;
    // Garantir que os mapas de conversas estão inicializados
    if (!conversasPorUsuario.has(de)) conversasPorUsuario.set(de, []);
    if (!conversasPorUsuario.has(para)) conversasPorUsuario.set(para, []);

    // Atualizar ou adicionar conversa para remetente e destinatário
    atualizaOuAdicionaConversa(conversasPorUsuario.get(de), para, conteudo);
    atualizaOuAdicionaConversa(conversasPorUsuario.get(para), de, conteudo);

    // Criar chave única para a conversa (independente da ordem)
    const chave = [de, para].sort().join("-");
    if (!mensagensPorConversa.has(chave)) mensagensPorConversa.set(chave, []);

    // Adicionar mensagem no histórico da conversa
    mensagensPorConversa.get(chave).push({
      de,
      para,
      conteudo,
      timestamp: new Date().toISOString(),
    });

    // Enviar mensagem para todos os sockets do remetente
    const socketsDe = usuarioToSockets.get(de);
    if (socketsDe) {
      socketsDe.forEach((sId) => {
        io.to(sId).emit("chat message", { ...msg, status: "enviada" });
      });
    }

    // Enviar mensagem para todos os sockets do destinatário
    const socketsPara = usuarioToSockets.get(para);
    if (socketsPara) {
      socketsPara.forEach((sId) => {
        io.to(sId).emit("chat message", { ...msg, status: "enviada" });
      });
    }

    // Atualizar lista de conversas para remetente e destinatário
    if (socketsDe) {
      socketsDe.forEach((sId) => {
        io.to(sId).emit("conversas-ativas", conversasPorUsuario.get(de));
      });
    }
    if (socketsPara) {
      socketsPara.forEach((sId) => {
        io.to(sId).emit("conversas-ativas", conversasPorUsuario.get(para));
      });
    }
  });

  // Evento: listar conversas ativas do usuário
  socket.on("listar-conversas-ativas", () => {
    const usuarioId = socketToUsuario.get(socket.id);
    if (!usuarioId) return;

    const conversas = conversasPorUsuario.get(usuarioId) || [];
    socket.emit("conversas-ativas", conversas);
  });

  // Evento: carregar histórico de conversa entre dois usuários
  socket.on("carregar-conversa", ({ usuarioA, usuarioB }) => {
    // Garantir listas de conversa inicializadas
    if (!conversasPorUsuario.has(usuarioA))
      conversasPorUsuario.set(usuarioA, []);
    if (!conversasPorUsuario.has(usuarioB))
      conversasPorUsuario.set(usuarioB, []);

    const conversaA = conversasPorUsuario.get(usuarioA);
    const conversaB = conversasPorUsuario.get(usuarioB);

    // Garantir que conversa existe para ambos os usuários
    if (!conversaA.find((c) => c.usuarioId === usuarioB)) {
      conversaA.push({
        usuarioId: usuarioB,
        ultimaMensagem: "",
        dataUltimaMensagem: new Date().toISOString(),
      });
    }
    if (!conversaB.find((c) => c.usuarioId === usuarioA)) {
      conversaB.push({
        usuarioId: usuarioA,
        ultimaMensagem: "",
        dataUltimaMensagem: new Date().toISOString(),
      });
    }

    // Obter mensagens da conversa
    const chave = [usuarioA, usuarioB].sort().join("-");
    const mensagens = mensagensPorConversa.get(chave) || [];
    // Enviar histórico para quem pediu
    socket.emit("conversa-carregada", { mensagens, com: usuarioB });
    // Enviar lista atualizada de conversas para o usuário
    socket.emit("conversas-ativas", conversaA);
  });

  // Evento: solicitar lista de usuários online
  socket.on("solicitar-usuarios-online", () => {
    const usuarioId = socketToUsuario.get(socket.id);
    if (!usuarioId) return;

    // Enviar todos os usuários conectados menos o próprio
    const outrosUsuarios = Array.from(usuariosConectados).filter(
      (id) => id !== usuarioId
    );
    socket.emit("usuarios-online", outrosUsuarios);
  });

  // Evento: desconectar socket
  socket.on("disconnect", () => {
    const usuarioId = socketToUsuario.get(socket.id);

    if (usuarioId) {
      usuariosConectados.delete(usuarioId); // Remove usuário dos conectados
      socketToUsuario.delete(socket.id); // Remove socket do mapa

      // Remove socket do Set de sockets do usuário
      const sockets = usuarioToSockets.get(usuarioId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) usuarioToSockets.delete(usuarioId); // Se nenhum socket, remove o usuário da lista
      }

      console.log(`Usuário desconectado: ${usuarioId}`);
    } else {
      console.log(`Socket desconectado: ${socket.id}`);
    }

    // Atualiza todos os clientes com a lista de usuários online
    io.emit("usuarios-online", Array.from(usuariosConectados));
  });
});

server.listen(3001, "0.0.0.0", () => {
  console.log("Servidor socket rodando em http://0.0.0.0:3001");
});

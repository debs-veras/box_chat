# BoxChat

Clone simples de WhatsApp com React, TypeScript, Tailwind CSS e Socket.IO.

---

## Descrição

Este projeto é um sistema de chat em tempo real que permite conversas entre usuários conectados. Foi desenvolvido usando React para o frontend e Socket.IO com Node.js para o backend.

---

## Tecnologias Utilizadas

- React 18 + TypeScript
- Tailwind CSS
- Socket.IO (cliente e servidor)
- Node.js + Express (servidor)
- Vite (bundler)

---

## Funcionalidades

- Lista de usuários online em tempo real
- Criação de conversas entre usuários
- Envio e recebimento de mensagens em tempo real
- Histórico simples de mensagens por conversa
- Criação de Modelos de mensagens

---

## Como rodar o projeto
Baixe primeiro o projeto com o seguinte comando
```bash
git clone https://github.com/seu-usuario/box_chat.git
```

1. Navegue até a pasta do projeto baixado e rode o comando:
   ```bash
   npm install (podendo utilizar o gerenciador de pacotes que vc mais utiliza)

2. Antes de rodar o projeto frontend é necessario abrir o servidor que está dentro da raiz do projeto:
   ```bash
   node server.js

3. Ainda na raiz do projeto rode o frontend com o seguinte comando:
   ```bash
   npm run dev --host
4. Agora é necessário configurar o servidor e para isso na raiz do projeto crie as seguinte váriaveis 
   ```bash
   VITE_SERVER_URL=http://<ip_local_da_sua_maquina>:<porta_que_o_server_esta_rodando>
   SERVER_URL=http://<ip_local_da_sua_maquina>:<porta_que_o_front_esta_rodando>
5. Em seguida abra o seguinte link em seu navegador
   ```bash
   http://<ip_local_da_sua_maquina>:<porta_que_o_front_esta_rodando>

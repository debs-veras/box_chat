export type Conversa = {
  usuarioId: string;
  mensagens: Array<string> | null;
  ultimaMensagem: string;
  dataUltimaMensagem: string;
};

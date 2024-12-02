import { Contato, Mensagem } from "./Mensagem.d";

export type Conversa = {
    id: number;
    ultimaMensagem: Mensagem | null;
    contato: Contato;
    mensagensPendentes: number;
}

export type ConversaListagem = {
    remetente: string;
    destinatario: string;
}
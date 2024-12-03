import { Contato } from "./contato.d";
import { Mensagem } from "./mensagem.d";

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
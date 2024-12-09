import { Contato } from "./contato.d";
import { grupoDeMensagem } from "./grupoDeContatos";
import { Mensagem } from "./mensagem.d";

export type Conversa = {
    id: number;
    grupo?: grupoDeMensagem;
    ultimaMensagem: Mensagem | null;
    contato?: Contato;
    mensagensPendentes: number;
}

export type ConversaListagem = {
    remetente: string;
    destinatario: string;
}
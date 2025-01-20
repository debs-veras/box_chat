import { Mensagem } from "./mensagem.d";

export type ListUltimasConversas = {
    id?: number;
    remetente: string;
    destinatario: string;
    texto: string;
    dataEnvio: string;
    dataRecebimento: string;
    dataVisualizacao: string;
}

export type ConversaListagem = {
    contatoId: number;
    contatoNome: string;
    contatoNumero: string;
    dataUltimaMensagem: string;
    ultimaMensagem: string;
    mensagensPendentes: number;
    mensagens: Array<Mensagem>;
    id?: number;
}
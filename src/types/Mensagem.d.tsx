export type Menssagem = {
    id?: number;
    remetente?: string;
    destinatario?: string;
    texto?: string;
    horario?: string;
    data_envio?: string;
    data_recebimento?: string;
    data_visualizacao?: string;
}

export type Contato = {
    id?: number;
    nome: string;
    numero: string;
    foto?: string;
}

export type Conversa = {
    id: number;
    ultimaMensagem: Menssagem | null;
    contato: Contato;
    mensagensPendentes: number;
}
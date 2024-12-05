export type Mensagem = {
    id?: number;
    remetente?: string;
    destinatario?: string;
    texto?: string;
    horario?: string;
    data_envio?: string;
    data_recebimento?: string;
    data_visualizacao?: string;
}

export type EnviarMensagem = {
    remetente: string;
    destinatario: string;
    texto: string;
}
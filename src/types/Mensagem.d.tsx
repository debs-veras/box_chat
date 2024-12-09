export type Mensagem = {
    id?: number;
    remetente?: string;
    destinatario?: string;
    texto?: string;
    horario?: string;
    dataEnvio?: string;
    dataRecebimento?: string;
    dataVisualizacao?: string;
}

export type EnviarMensagem = {
    remetente: string;
    destinatario: string;
    texto: string;
}
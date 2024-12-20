export type Mensagem = {
    id?: number;
    remetente?: string;
    destinatario?: string;
    texto?: string;
    dataEnvio?: string;
    dataRecebimento?: string;
    dataVisualizacao?: string;
}

export type EnviarMensagem = {
    remetente: string;
    destinatario: string;
    texto: string;
}

export type EnviarMensagemGrupo = {
    remetente: string;
    texto: string;
    grupoIds: Array<number>; 
}
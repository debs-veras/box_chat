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
    id?: number;
    contatoId: number | null;
    texto: string;
    campanhaId?: number;
    dataEnvio?: string;
    dataRecebimento?: string;
    dataVisualizacao?: string;
}

export type EnviarMensagemGrupo = {
    texto: string;
    grupoIds: Array<number>; 
}
export type Menssagem = {
    id?: number;
    autor?: string;
    menssagem?: string;
    horario?: string;
    data_envio?: string;
    data_recebimento?: string;
    data_visualizacao?: string;
}

export type Contato = {
    id?: number;
    nome: string;
    foto: string;
}

export type Conversation = {
    id: number;
    ultimaMensagem: Menssagem | null;
    contato: Contato;
    mensagensPendentes: number;
}
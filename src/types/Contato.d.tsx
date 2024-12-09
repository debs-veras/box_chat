export type Contato = {
    id: number;
    nome: string;
    numero: string;
    email?: string;
    foto?: string;
}

export type ContatoCadastro = {
    id?: number;
    nome: string;
    numero: string;
}
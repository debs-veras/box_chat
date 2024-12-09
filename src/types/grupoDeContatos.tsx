export interface GruposDeContatos {
    id: number;
    nome: string;
    descricao: string;
    contatoIds: number[];
}

export interface CadastroGruposDeContatos {
    id?: number;
    nome: string;
    descricao: string;
    contatoIds: Array<number>;
}